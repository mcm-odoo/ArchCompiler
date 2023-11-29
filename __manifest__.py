{
    'name': 'Arch',
    'version': '1.0',
    'description': """Playground""",
    'depends': ['web', 'contacts'],
    'data': [],
    'installable': True,
    # 'auto_install': True,
    'license': 'LGPL-3',
    'assets': {
        'web.assets_backend': [
            'arch/static/src/**/*',
        ],
    },
}
