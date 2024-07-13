odoo.define('pos_no_negative_stock.productScreen', function(require) {
    "use strict";

    const Registries = require('point_of_sale.Registries');
    const ProductScreen = require('point_of_sale.ProductScreen');
    var rpc = require('web.rpc');

    const BiProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            constructor() {
                super(...arguments);
            }

            async _onClickPay() {
                var self = this;
                let order = this.env.pos.get_order();
                let lines = order.get_orderlines();
                let pos_config = self.env.pos.config;
                let call_super = true;
                var config_id = self.env.pos.config.id;
                let prod_used_qty = {};
                let quantities = [];

                if (pos_config.restrict_zero_qty) {
                    for (let i = 0; i < lines.length; i++) {
                        let prod = lines[i].product;
                        const response = await rpc.query({
                            model: 'pos.session',
                            method: 'get_product_qty_of_location',
                            args: [prod.id, config_id]
                        }).then(function(res) {
                            return res;
                        });
                        quantities.push(response);
                    }

                    $.each(lines, function(i, line) {
                        let prd = line.product;
                        if (prd.type == 'product') {
                            if (prd.id in prod_used_qty) {
                                let old_qty = prod_used_qty[prd.id][1];
                                prod_used_qty[prd.id] = [prd.qty_available, line.quantity + old_qty];
                            } else {
                                prod_used_qty[prd.id] = [prd.qty_available, line.quantity];
                            }
                        }
                        let counter = 0;
                        if (prd.qty_available <= 0) {
                            call_super = false;
                            let warning = 'Product (' + prd.display_name + ') is out of stock!';
                            self.showPopup('ErrorPopup', {
                                title: self.env._t('\n' + 'Cantidad cero no permitida'),
                                body: self.env._t(warning),
                            });
                        } else {
                            if (line.quantity > quantities[counter]) {
                                call_super = false;
                                let warning = 'Product (' + prd.display_name + ') Fuera de Inventario!';
                                self.showPopup('ErrorPopup', {
                                    title: self.env._t('Producto Sin Stock en está Ubicación, Favor Validar su Inventario'),
                                    body: self.env._t(warning),
                                });
                            }
                        }
                        counter += 1;
                    });
                }

                if (call_super) {
                    super._onClickPay();
                }
            }
        };

    Registries.Component.extend(ProductScreen, BiProductScreen);

    return ProductScreen;
});