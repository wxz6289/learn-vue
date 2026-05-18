export const focus = {
  mounted(el, bindings, vm, pvm) {
    console.log(el, 'el mounted', bindings, vm, pvm);
    el.focus();
  },
  updated(el) {
    el.focus();
  },
}