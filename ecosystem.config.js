module.exports = {
    apps:[
        {
            name          :'API',
            script        :'./bin/www',
            watch         :false,
            env           :{
                'PORT'    :3036,
                'NODE_ENV':'development'
            },
            env_production:{
                'PORT'    :3036,
                'NODE_ENV':'production'
            },
            env_public    :{
                'PORT'    :3036,
                'NODE_ENV':'public'
            }
        }
    ]
};