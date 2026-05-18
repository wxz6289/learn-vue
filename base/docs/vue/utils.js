// 缓存函数
function cached(fn){
    const cache = {};
    return function(str){
        return cache[str] || (cache[str] = fn(str));
    }
}

const camelize = cached(str => {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase(): '');
})


const capitalize = cached(str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

function bind(ctx, fn){
    const outerArg = Array.prototype.slice.call(arguments, 2);
    return function(){
        const innerArg = Array.prototype.slice.call(arguments);
        const args = Array.prototype.concat.call(outerArg, innerArg);
        return fn.apply(ctx, args)
    }
}

console.log(capitalize("hello"));
console.log(camelize("hello-world-"));

