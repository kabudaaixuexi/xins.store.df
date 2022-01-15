declare const moon: (data: any, self: any, persistedState?: boolean | undefined) => {
    $_set: (obj: any, key?: string | undefined) => void;
    $_watch: (key: any, cb: any, immediate?: boolean) => void;
    $_getData: (key?: string | undefined) => any;
};
export default moon;
