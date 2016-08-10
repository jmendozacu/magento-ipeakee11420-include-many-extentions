<?php

class Balance_Varnish_Model_Resource_Mysql4_Catalog_Category_Product_Collection
    extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    /**
     * Initialize resource model and define main table
     */
    protected function _construct()
    {
        $this->_init('varnish/catalog_category_product');
    }

    /**
     * Filter collection by product ids
     *
     * @param array $productIds
     *
     * @return Balance_Varnish_Model_Resource_Mysql4_Catalog_Category_Product_Collection
     */
    public function filterAllByProductIds(array $productIds)
    {
        $this->getSelect()
            ->where('product_id in (?)', $productIds)
            ->group('category_id');

        return $this;
    }
}
