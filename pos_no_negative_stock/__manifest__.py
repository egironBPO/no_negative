# -*- coding: utf-8 -*-
{
    'name': 'POS Restrict Zero or Negative Quantity ',
    'version': '16.0.0.0',
    'category': 'Point of Sale',
    'summary': 'Point Of Sale Restrict Zero Quantity pos restrict negative stock of point of sale (source loacation) of products with zero or negative stock levels pos restrict zero stock product pos Restrict product with zero Quantity pos order line restriction with zero Quantity on pos',
    'description' :"""
       The Point Of Sale Restrict negative or Zero Quantity Odoo App helps users to prevents the sales of products with zero or negative or out of stock in pos (source location) stock levels, ensuring that businesses never run out of stock. Additionally, the app can be configured to display a warning message when the stock level of a product is getting low. When a customer attempts to purchase a product with a stock level below the minimum, the app will display an error message, preventing the sale from going through.
    """,
    'author': "Kaizen Principles",
    'website': 'https://erp-software.odoo-saudi.com/discount/',
    'depends': ['base','point_of_sale'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets':{
        'point_of_sale.assets': [
            '/pos_no_negative_stock/static/src/js/ProductScreen.js',
         ],
    },
    'demo': [],
    'test': [],
    'license':'OPL-1',
    'installable': True,
    'auto_install': False,
    'price': 15,
    'currency': 'USD',
    "images": ['static/description/banner.gif'],

}
