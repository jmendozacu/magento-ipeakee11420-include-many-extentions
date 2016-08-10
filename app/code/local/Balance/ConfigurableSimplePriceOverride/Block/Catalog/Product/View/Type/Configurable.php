<?php

/*
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * It is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category   Balance
 * @package    ConfigurableSimplePriceOverride
 * @copyright  Copyright (c) 2011 Balance
 * @license    http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 */

class Balance_ConfigurableSimplePriceOverride_Block_Catalog_Product_View_Type_Configurable extends Mage_Catalog_Block_Product_View_Type_Configurable {

    /**
     * Preparing Json Object to pharse to the Product View Page
     *
     * @see Mage_Catalog_Block_Product_View_Type_Configurable::getJsonConfig()
     */
    public function getJsonConfig() {


        $config = Zend_Json::decode(parent::getJsonConfig());

        $childProducts = array();

        //Create the extra price and tier price data/html we need.
        foreach ($this->getAllowProducts() as $product) {

            $productId = $product->getId();

            $childProducts[$productId] = array(
                "price" => $this->_registerJsPrice($this->_convertPrice($product->getPrice())),
                "finalPrice" => $this->_registerJsPrice($this->_convertPrice($product->getFinalPrice()))
            );

            if (Mage::getStoreConfig('SCP_options/product_page/change_name')) {
                $childProducts[$productId]["productName"] = $product->getName();
            }
            if (Mage::getStoreConfig('SCP_options/product_page/change_description')) {
                $childProducts[$productId]["description"] = $product->getDescription();
            }
            if (Mage::getStoreConfig('SCP_options/product_page/change_short_description')) {
                $childProducts[$productId]["shortDescription"] = $product->getShortDescription();
            }

            $childBlock = $this->getLayout()->createBlock('catalog/product_view_attributes');
            $childProducts[$productId]["productAttributes"] = $childBlock->setTemplate('catalog/product/view/attributes.phtml')
                ->setProduct($product)
                ->toHtml();


            #if image changing is enabled..
            if (Mage::getStoreConfig('SCP_options/product_page/change_image')) {
                #but dont bother if fancy image changing is enabled
                if (!Mage::getStoreConfig('SCP_options/product_page/change_image_fancy')) {
                    #If image is not placeholder...
                    if ($product->getImage() !== 'no_selection') {
                        $childProducts[$productId]["imageUrl"] = (string) Mage::helper('catalog/image')->init($product, 'image');
                    }
                }
            }
        }


        if (is_array($config['attributes'])) {
            foreach ($config['attributes'] as $attributeID => &$info) {
                if (is_array($info['options'])) {
                    foreach ($info['options'] as &$option) {
                        unset($option['price']);
                    }
                    unset($option); //clear foreach var ref
                }
            }
            unset($info); //clear foreach var ref
        }

        $p = $this->getProduct();
        $moduleStatus = Mage::helper('configurablesimplepriceoverride')->checkModuelStatus($p);

        $config['childProducts'] = $childProducts;
        if ($p->getMaxPossibleFinalPrice() != $p->getFinalPrice()) {
            $config['priceFromLabel'] = $this->__('Price From:');
        } else {
            $config['priceFromLabel'] = $this->__('');
        }
        $config['ajaxBaseUrl'] = Mage::getUrl('oi/ajax/');
        $config['productName'] = $this->getProduct()->getName();
        $config['description'] = $this->getProduct()->getDescription();
        $config['shortDescription'] = $this->getProduct()->getShortDescription();

        if (Mage::getStoreConfig('SCP_options/product_page/change_image')) {
            $config["imageUrl"] = (string) Mage::helper('catalog/image')->init($this->getProduct(), 'image');
        }

        $childBlock = $this->getLayout()->createBlock('catalog/product_view_attributes');
        $config["productAttributes"] = $childBlock->setTemplate('catalog/product/view/attributes.phtml')
            ->setProduct($this->getProduct())
            ->toHtml();

        if (Mage::getStoreConfig('SCP_options/product_page/change_image')) {
            if (Mage::getStoreConfig('SCP_options/product_page/change_image_fancy')) {
                $childBlock = $this->getLayout()->createBlock('catalog/product_view_media');
                $config["imageZoomer"] = $childBlock->setTemplate('catalog/product/view/media.phtml')
                    ->setProduct($this->getProduct())
                    ->toHtml();
            }
        }

        if (Mage::getStoreConfig('SCP_options/product_page/show_price_ranges_in_options')) {
            $config['showPriceRangesInOptions'] = true;
            $config['rangeToLabel'] = $this->__('to');
        }
        if ($moduleStatus) {
            return Zend_Json::encode($config);
        } else {
            return parent::getJsonConfig();
        }

    }

}
