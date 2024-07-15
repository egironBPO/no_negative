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
                    let rpcCalls = lines.map(line => {
                        return rpc.query({
                            model: 'pos.session',
                            method: 'get_product_qty_of_location',
                            args: [line.product.id, config_id]
                        });
                    });

                    quantities = await Promise.all(rpcCalls);

                    lines.forEach((line, i) => {
                        let prd = line.product;
                        if (prd.type == 'product') {
                            if (prd.qty_available <= 0) {
                                call_super = false;
                                let warning = 'Producto (' + prd.display_name + ') fuera de Inventario!';
                                self.showPopup('ErrorPopup', {
                                    title: self.env._t('\n' + 'Cantidad cero no permitida'),
                                    body: self.env._t(warning),
                                });
                            } else if (line.quantity > quantities[i]) {
                                call_super = false;
                                let warning = 'Producto (' + prd.display_name + ') fuera de Inventario!';
                                self.showPopup('ErrorPopup', {
                                    title: self.env._t('Producto Sin Stock en esta Ubicación, Favor Validar su Inventario.'),
                                    body: self.env._t(warning),
                                });
                            }
                        }
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

