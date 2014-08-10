module.exports = {

    compile : {
        options : {

            appDir  : 'static',
            baseUrl : './',
            dir     : 'target/build-frontend',
            paths   : {
                'apps/ott' : './js',
                'v2': 'empty:'
            },
            optimize : 'uglify',

            logLevel: 2,

            uglify : {
                ascii_only : true
            },

            preserveLicenseComments: false,

            findNestedDependencies: false,

            normalizeDirDefines: "skip",

            skipDirOptimize: true,

            optimizeCss: 'standard.keepLines',


            // All modules overhere
            modules : [
                {
                    name : 'apps/ott/ott-app',
                    exclude : [
                        'v2/lib/jquery',
                        'v2/window-events'
                    ]
                },
                {
                    name : 'apps/ott/ott-mail',
                    exclude: [
                        'apps/ott/ott-values',
                        'apps/ott/ott-constants',
                        'apps/ott/ott-utils'
                    ]
                }
            ]

        }
    }
};