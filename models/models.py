# -*- coding: utf-8 -*-

from odoo import api, models

class Base(models.AbstractModel):
    _inherit = 'base'

    def arch_delete(self):
        return self.unlink()

    def arch_get(self, specification):
        return self.web_read(specification)

    def arch_save(self, values, specification):
        if self:
            self.write(values)
        else:
            self = self.create(values)
        return self.with_context(bin_size=True).web_read(specification)

    def _get_groups(self, domain, groupby):
        web_read_group_result = self.web_read_group(domain, [], groupby) # do not use web_read_group

        ids = set()
        groups = []
        for group in web_read_group_result['groups']:
            group_data = {}
            if len(groupby) > 1:
                sub_data = self._get_groups(group['__domain'], groupby[1:])
                ids = ids.union(sub_data['ids'])
                group_data = {
                    'type': 'groups',
                    'value': group[groupby[0]],
                    'domain': group['__domain'],
                    'count': sub_data['count'],
                    'groups': sub_data['groups'],
                    'aggregates': {},
                }
            else:
                sub_data = self.search(group['__domain'])
                count = len(sub_data)
                ids = ids.union(sub_data.ids)
                group_data = {
                    'type': 'records',
                    'value': group[groupby[0]],
                    'domain': group['__domain'],
                    'count': count,
                    'records': sub_data.ids,
                    'aggregates': {},
                }
            groups.append(group_data)

        return {
            'count': web_read_group_result['length'],
            'groups': groups,
            'ids': ids,
        }

    @api.model
    def arch_search(self, domain, specification, groupby=None):
        if groupby:
            result = self._get_groups(domain, groupby)
            return {
                'count': result['count'],
                'records': self.browse(result['ids']).web_read(specification), # do not use web_read
                'groups': result['groups'],
            }
        else:
            result = self.web_search_read(domain, specification)
            return {
                'count': result['length'],
                'records': result['records'],
                'groups': [],
            }
