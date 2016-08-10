<?php
/**
 * aheadWorks Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://ecommerce.aheadworks.com/AW-LICENSE-ENTERPRISE.txt
 * 
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This package designed for Magento ENTERPRISE edition
 * aheadWorks does not guarantee correct work of this extension
 * on any other Magento edition except Magento ENTERPRISE edition.
 * aheadWorks does not provide extension support in case of
 * incorrect edition usage.
 * =================================================================
 *
 * @category   AW
 * @package    AW_Blog
 * @copyright  Copyright (c) 2010-2011 aheadWorks Co. (http://www.aheadworks.com)
 * @license    http://ecommerce.aheadworks.com/AW-LICENSE-ENTERPRISE.txt
 */
class AW_Blog_Model_Blog extends Mage_Core_Model_Abstract{
    public function _construct(){
        parent::_construct();
        $this->_init('blog/blog');
    }
    
    public function getShortContent(){
        $content = $this->getData('short_content');
        if(Mage::getStoreConfig(AW_Blog_Helper_Config::XML_BLOG_PARSE_CMS)){
            $processor = Mage::getModel('core/email_template_filter');
            $content = $processor->filter($content);
        }
        return $content;
    }

    public function getPostContent(){
        $content = $this->getData('post_content');
        if(Mage::getStoreConfig(AW_Blog_Helper_Config::XML_BLOG_PARSE_CMS)){
            $processor = Mage::getModel('core/email_template_filter');
            $content = $processor->filter($content);
        }
        return $content;
    }
    
    public function _beforeSave(){
        if(is_array($this->getData('tags'))){
            $this->setData('tags', implode(",", $this->getData('tags')));
        }
        return parent::_beforeSave();
    }
}
