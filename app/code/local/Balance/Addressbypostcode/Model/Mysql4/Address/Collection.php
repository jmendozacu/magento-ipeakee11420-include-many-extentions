<?php
/**
 * @author  Balance Internet
 */
class Balance_Addressbypostcode_Model_Mysql4_Address_Collection extends Mage_Core_Model_Resource_Db_Collection_Abstract
{

    protected function _construct()
    {
        $this->_init('addressbypostcode/address');
    }

}