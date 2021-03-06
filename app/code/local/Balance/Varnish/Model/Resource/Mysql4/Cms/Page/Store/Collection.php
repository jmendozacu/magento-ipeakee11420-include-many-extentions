<?php

class Balance_Varnish_Model_Resource_Mysql4_Cms_Page_Store_Collection
    extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    /**
     * Initialize resource model and define main table
     */
    protected function _construct()
    {
        $this->_init('varnish/cms_page_store');
    }

    /**
     * Add cms page id filter
     *
     * @param int $id
     *
     * @return Balance_Varnish_Model_Resource_Mysql4_Cms_Page_Store_Collection
     */
    public function addPageFilter($id)
    {
        $this->getSelect()
            ->where('page_id = ?', $id);

        return $this;
    }
}
