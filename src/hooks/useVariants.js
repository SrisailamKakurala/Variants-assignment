import { useState, useEffect } from 'react';

const useVariants = () => {
  const [variants, setVariants] = useState([]);
  const [variantInstances, setVariantInstances] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedVariants, setSelectedVariants] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const addVariant = () => {
    const newId = Date.now();
    setVariants([...variants, {
      id: newId,
      name: '',
      values: [{ id: Date.now() + 1, value: '' }]
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
        const newValueId = Date.now() + Math.random();
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
          const newValueId = Date.now() + Math.random();
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
          const newValueId = Date.now() + Math.random();
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
    if (sourceIndex === targetIndex) return;

    const newVariants = [...variants];
    const [movedVariant] = newVariants.splice(sourceIndex, 1);
    newVariants.splice(targetIndex, 0, movedVariant);
    setVariants(newVariants);
  };

  const reorderValues = (variantId, sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;

    setVariants(variants.map(v => {
      if (v.id === variantId) {
        const newValues = [...v.values];
        const [movedValue] = newValues.splice(sourceIndex, 1);
        newValues.splice(targetIndex, 0, movedValue);
        return { ...v, values: newValues };
      }
      return v;
    }));
  };

  const getPermutations = () => {
    if (variants.length === 0) return [];

    // Filter variants with valid names and non-empty values
    const validVariants = variants.filter(v => v.name.trim());
    const valueLists = validVariants.map(v =>
      v.values
        .filter(val => val.value && val.value.trim())
        .map(val => val.value.trim())
    ).filter(list => list.length > 0);

    const optionNames = validVariants.map(v => v.name.trim());

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

      // Clean up old instances
      Object.keys(newInst).forEach(name => {
        if (!currentNames.includes(name)) {
          delete newInst[name];
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

  const validVariants = variants.filter(v => v.name.trim());

  // ✅ Case 1: Only ONE variant → return flat list (no nesting, no groups)
  if (validVariants.length === 1) {
    return {
      All: perms.map(p => ({
        ...p,
        name: p.parts[0].value, // just show value (e.g., "SM")
      })),
    };
  }

  // ✅ Case 2: Multiple variants → normal grouping
  if (!groupBy || !variants.some(v => v.name.trim() === groupBy)) {
    return { 'All': perms };
  }

  const groupIndex = variants.findIndex(v => v.name.trim() === groupBy);
  if (groupIndex === -1) return { 'All': perms };

  const groups = {};
  perms.forEach(p => {
    const groupValue = p.parts.find(part => part.option === groupBy)?.value || 'Unknown';
    if (!groupValue) return;

    if (!groups[groupValue]) groups[groupValue] = [];

    const otherParts = p.parts.filter(part => part.option !== groupBy);
    const subName = otherParts.map(part => part.value).join(' / ');

    // 🔥 If no other parts, just use the group value
    const finalName = subName || groupValue;

    groups[groupValue].push({ ...p, name: finalName });
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
      const allSelected = groupPerms.every(p => newSet.has(p.name));
      if (allSelected) {
        groupSet.forEach(n => newSet.delete(n));
      } else {
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