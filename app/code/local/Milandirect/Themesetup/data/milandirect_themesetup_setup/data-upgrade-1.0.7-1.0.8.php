<?php

/**
 * Install script to add cms blocks and cms pages
 *
 * @category  Themesetup
 * @package   Milandirect_Themesetup
 * @author    Balance Internet Team <dev@balanceinternet.com.au>
 * @copyright 2016 Balance
 */

// update shipping
$installer = $this;
$installer->startSetup();

$dataPath = Mage::getModuleDir('data', 'Milandirect_Themesetup');
$dataPath .= DS . 'milandirect_themesetup_setup' . DS . 'data';


// Update shipping config
$encoded    = file_get_contents($dataPath . DS . 'shippingsetting29042016.json');
$shippingCf   = json_decode($encoded, true);
Mage::log("Total shiping settting".sizeof($shippingCf), null, 'testscript.log');

foreach ($shippingCf as $config) {
    $installer->setConfigData($config['path'], $config['value'], $config['scope'], $config['scope_id']);
}
$installer->endSetup();
