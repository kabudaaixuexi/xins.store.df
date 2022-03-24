/**
 * @auther nr
 * @param data
 * @param self Mounted object 
 * @param persistedState Persistent
 * @returns {}
 */
const moon = (data: any, self:any, persistedState?:boolean) => {
	const _self = self
    
    // States default
	const _data = data

    // States of proxy type
	let _data_proxy: any = {}

    // Callback of watch
	let _callback: any = {}
    
    // Set States
	const $_set = (obj: any, key?: string) => {
        // If set, specify the key name，only update or add corresponding key value
        if (key) {
            _data_proxy[key] = obj
        }  else {
            Object.keys(obj).map((key) => {
                _data_proxy[key] = obj[key]
            })
        }
	}

	const $_watch = (key: any, cb: any, immediate = false) => {

		_callback = Object.assign({}, _callback, {
			[key]: _callback[key] || []
		});

        // 一个组件周期内一个队象限制一个watch，限制watch粒度
		_callback[key] = [cb]
		// (_callback as any)[key].push(cb)
        
		_data_proxy = new Proxy(_data, {
			get (target, name, receiver) {
				return Reflect.get(target, name, receiver)
			},
			set (target, name, value, receiver) {
				if (Array.isArray(_callback[name])) {
					_callback[name].map((func: any) => func(value, (_data as any)[name]))
				}
				return Reflect.set(target, name, value, receiver)
			}
		})

        // Trigger listening during initialization
        immediate && $_set(_data_proxy)

        // Persistence
        if (persistedState) {
            sessionStorage.getItem("moon") && $_set(JSON.parse((sessionStorage.getItem("moon") as any)))
            window.addEventListener("beforeunload",()=>{
                sessionStorage.setItem("moon",JSON.stringify($_getData()))
            })
        }
	}
    // Get States
	const $_getData = (key?:string) => {
		return key ? _data[key] : _data
	}
    if (_self) {
        _self.$_set = $_set;
        _self.$_watch = $_watch;
        _self.$_getData = $_getData
    } 
	return {
		$_set,
        $_watch,
        $_getData
	}
}
export default moon