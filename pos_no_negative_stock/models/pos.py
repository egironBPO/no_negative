# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class PosConfigPrevent(models.Model):
	_inherit = "pos.config"

	restrict_zero_qty = fields.Boolean(string='Restrict Zero Quantity')


class ResConfigSettingsPrevent(models.TransientModel):
    _inherit = 'res.config.settings'

    restrict_zero_qty = fields.Boolean(string='Restrict Zero Quantity')

    @api.model
    def get_values(self):
        res = super(ResConfigSettingsPrevent, self).get_values()
        pos_config = self.env['pos.config'].search([], limit=1)
        res.update(
            restrict_zero_qty=pos_config.restrict_zero_qty
        )
        return res

    def set_values(self):
        super(ResConfigSettingsPrevent, self).set_values()
        pos_config = self.env['pos.config'].search([], limit=1)
        if pos_config:
            pos_config.write({
                'restrict_zero_qty': self.restrict_zero_qty
            })


class PosSessionPrevent(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        result['search_params']['fields'].extend(['qty_available', 'type'])
        return result

    @api.model
    def get_product_qty_of_location(self, prd, config_id):
        stock = self.env["pos.config"].browse(config_id).picking_type_id.default_location_src_id
        quant = self.env["stock.quant"].search([('product_id', '=', prd), ('location_id', '=', stock.id)])
        total_qty = 0
        if quant:
            for qty in quant:
                total_qty += qty.quantity
            return total_qty
        else:
            return total_qty

