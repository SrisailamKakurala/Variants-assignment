import { PlusCircle } from "lucide-react";
import Button from "../UI/Button";
import VariantList from "./VariantList";
import useVariants from "../../hooks/useVariants";

const VariantManager = () => {
  const {
    variants,
    addVariant,
    updateName,
    addValue,
    updateValue,
    removeValue,
    removeVariant,
    reorderVariants,
    reorderValues,
    getGroupedVariants,
    groupBy,
    setGroupBy,
    expandedGroups,
    toggleGroup,
    expandAll,
    collapseAll,
    updatePrice,
    updateInventory,
    totalInventory,
    selectedVariants,
    handleSelectAll,
    handleGroupSelect,
    handleSubSelect,
  } = useVariants();

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-md font-semibold mb-6">Variants</h2>
      <VariantList
        variants={variants}
        addVariant={addVariant}
        updateName={updateName}
        addValue={addValue}
        updateValue={updateValue}
        removeValue={removeValue}
        removeVariant={removeVariant}
        reorderVariants={reorderVariants}
        reorderValues={reorderValues}
        getGroupedVariants={getGroupedVariants}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
        expandAll={expandAll}
        collapseAll={collapseAll}
        updatePrice={updatePrice}
        updateInventory={updateInventory}
        totalInventory={totalInventory}
        selectedVariants={selectedVariants}
        handleSelectAll={handleSelectAll}
        handleGroupSelect={handleGroupSelect}
        handleSubSelect={handleSubSelect}
      />
      {variants.length === 0 && (
        <Button onClick={addVariant} className="mt-3 font-semibold" variant="default">
          <PlusCircle size={16} /> Add options like size or color
        </Button>
      )}
    </div>
  );
};

export default VariantManager;