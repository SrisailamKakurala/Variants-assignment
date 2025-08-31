import { useState, useEffect } from 'react';

const useVariants = () => {
  const [variants, setVariants] = useState([]);
  const [variantInstances, setVariantInstances] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedVariants, setSelectedVariants] = useState(new Set());

  const addVariant = () => {
    const newId = Date.now();
    setVariants([...variants, { 
      id: newId, 
      name: '', 
      values: [{ id: Date.now(), value: '' }] 
    }]);
  };

  const updateName = (id, name) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, name: name || '' } : v
    ));
  };

  const addValue = (variantId) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        const newValueId = Date.now();
        return { 
          ...v, 
          values: [...v.values, { id: newValueId, value: '' }] 
        };
      }
      return v;
    }));
  };

  const updateValue = (variantId, valueId, value) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        const updatedValues = v.values.map(val => 
          val.id === valueId ? { ...val, value: value || '' } : val
        );
        
        const lastValue = updatedValues[updatedValues.length - 1];
        if (lastValue.id === valueId && value && value.trim()) {
          const newValueId = Date.now();
          updatedValues.push({ id: newValueId, value: '' });
        }
        
        return { ...v, values: updatedValues };
      }
      return v;
    }));
  };

  const removeValue = (variantId, valueId) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        let filteredValues = v.values.filter(val => val.id !== valueId);
        
        if (filteredValues.length === 0 || filteredValues.every(val => val.value.trim())) {
          const newValueId = Date.now();
          filteredValues.push({ id: newValueId, value: '' });
        }
        
        return { ...v, values: filteredValues };
      }
      return v;
    }));
  };

  const removeVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const reorderVariants = (sourceIndex, targetIndex) => {
    const newVariants = [...variants];
    const [moved] = newVariants.splice(sourceIndex, 1);
    newVariants.splice(targetIndex, 0, moved);
    setVariants(newVariants);
  };

  const reorderValues = (variantId, sourceIndex, targetIndex) => {
    setVariants(variants.map(v => {
      if (v.id === variantId) {
        const newValues = [...v.values];
        const [moved] = newValues.splice(sourceIndex, 1);
        newValues.splice(targetIndex, 0, moved);
        return { ...v, values: newValues };
      }
      return v;
    }));
  };

  const getPermutations = () => {
    if (variants.length === 0) return [];

    const valueLists = variants.map(v => 
      v.values
        .filter(val => val.value && val.value.trim()) // Only include non-empty values
        .map(val => val.value.trim())
    ).filter(list => list.length > 0); // Only include variants with values

    const optionNames = variants.map(v => 
      v.name.trim() || 'Variant ' + (variants.indexOf(v) + 1)
    );

    if (valueLists.length === 0) return [];

    const cartesianProduct = (...arrays) => 
      arrays.reduce((acc, arr) => 
        acc.flatMap(a => arr.map(b => [...a, b])), [[]]
      );

    const combos = cartesianProduct(...valueLists);
    
    return combos.map(combo => {
      const name = combo.join(' / ');
      const parts = optionNames.map((opt, i) => ({ 
        option: opt, 
        value: combo[i] || '' 
      }));
      const instance = variantInstances[name] || { price: 0.00, inventory: 0 };
      return { name, parts, ...instance };
    });
  };

  useEffect(() => {
    const permutations = getPermutations();
    const currentNames = permutations.map(p => p.name);
    
    setVariantInstances(prev => {
      const newInst = { ...prev };
      currentNames.forEach(name => {
        if (!newInst[name]) {
          newInst[name] = { price: 0.00, inventory: 0 };
        }
      });
      return newInst;
    });
  }, [variants]);

  const updatePrice = (name, price) => {
    const parsedPrice = parseFloat(price) || 0.00;
    setVariantInstances(prev => ({
      ...prev,
      [name]: { ...prev[name], price: parsedPrice }
    }));
  };

  const updateInventory = (name, inventory) => {
    const parsedInventory = parseInt(inventory) || 0;
    setVariantInstances(prev => ({
      ...prev,
      [name]: { ...prev[name], inventory: parsedInventory }
    }));
  };

  useEffect(() => {
    if (variants.length > 0) {
      const validVariants = variants.filter(v => v.name.trim());
      if (validVariants.length > 0 && (!groupBy || !validVariants.some(v => v.name === groupBy))) {
        setGroupBy(validVariants[0].name);
      }
    }
  }, [variants, groupBy]);

  const getGroupedVariants = () => {
    const perms = getPermutations();
    if (perms.length === 0) return { 'All': [] };

    if (!groupBy || !variants.some(v => v.name === groupBy)) {
      return { 'All': perms };
    }

    const groups = {};
    perms.forEach(p => {
      const groupValue = p.parts.find(part => part.option === groupBy)?.value || 'Unknown';
      if (!groups[groupValue]) groups[groupValue] = [];
      groups[groupValue].push(p);
    });

    return groups;
  };

  useEffect(() => {
    const groups = Object.keys(getGroupedVariants());
    setExpandedGroups(new Set(groups));
  }, [groupBy, variants]);

  const toggleGroup = (group) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(Object.keys(getGroupedVariants())));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handleSelectAll = () => {
    const allPerms = Object.values(getGroupedVariants()).flat();
    if (allPerms.length === 0) return;
    
    if (selectedVariants.size === allPerms.length && allPerms.length > 0) {
      setSelectedVariants(new Set());
    } else {
      const newSelected = new Set(allPerms.map(p => p.name));
      setSelectedVariants(newSelected);
    }
  };

  const handleGroupSelect = (group) => {
    const groupPerms = getGroupedVariants()[group] || [];
    if (groupPerms.length === 0) return;
    
    const groupSet = new Set(groupPerms.map(p => p.name));
    
    setSelectedVariants(prev => {
      const newSet = new Set(prev);
      const selectedInGroup = [...newSet].filter(n => groupSet.has(n));
      
      if (selectedInGroup.length === groupPerms.length && groupPerms.length > 0) {
        // Unselect all in group
        groupSet.forEach(n => newSet.delete(n));
      } else {
        // Select all in group
        groupSet.forEach(n => newSet.add(n));
      }
      return newSet;
    });
  };

  const handleSubSelect = (name) => {
    setSelectedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const totalInventory = getPermutations().reduce((sum, p) => sum + p.inventory, 0);

  return {
    variants,
    addVariant,
    updateName,
    addValue,
    updateValue,
    removeValue,
    removeVariant,
    reorderVariants,
    reorderValues,
    getPermutations,
    updatePrice,
    updateInventory,
    groupBy,
    setGroupBy,
    getGroupedVariants,
    expandedGroups,
    toggleGroup,
    expandAll,
    collapseAll,
    totalInventory,
    selectedVariants,
    handleSelectAll,
    handleGroupSelect,
    handleSubSelect,
  };
};

export default useVariants;