import { createInjectionState } from '@vueuse/core';
import { computed, shallowRef } from 'vue';

export const counterKey = Symbol('counterStore');

const [useProvideCounterStore, useCounterStore] = createInjectionState((initialValue) => {
  const count = shallowRef(initialValue);
  const double = computed(() => count.value * 2);

  const increment = () => {
    count.value++;
  };

  return {
    count,
    double,
    increment
  };
}, { injectionKey: counterKey, defaultValue: 0 });

export { useProvideCounterStore, useCounterStore };

export function useCounterStoreWithDefaultValue() {
  return useCounterStore() ?? {
    count: shallowRef(0),
    double: computed(() => 0),
    increment: () => {}
  }
}

export function useCounterStoreOrThrow() {
  const store = useCounterStore();
  if (!store) {
    throw new Error('Counter store is not provided');
  }
  return store;
}
