import "reflect-metadata";
import Vue from "vue";
import { createDecorator } from "vue-class-component";
import { Common } from "./common";

const objects: any[] = [];

function descriptorOf(
  target: any,
  propertyKey: string,
): PropertyDescriptor | undefined {
  return Reflect.getOwnPropertyDescriptor(
    (target && target.prototype) || target,
    propertyKey,
  );
}
export function AutowiredService(target: any, key: string) {
  const type = Reflect.getMetadata("design:type", target, key);
  let n: any = null;
  for (const o of objects) {
    if (o instanceof type) {
      n = o;
      break;
    }
  }
  if (n == null) {
    n = new type();
    objects.push(n);
  }
  const getter = () => {
    if (n) {
      return n;
    } else {
      return () => {
        return null;
      };
    }
  };
  if (delete target[key]) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: getter,
      set: undefined,
    });
  }
}

/**
 * 注入service，类属性修饰器
 * @param params 实例化参数
 */
export const Autowired = (params: any = "") => {
  return (target: any, propertyKey: string) => {
    // 获取该属性的类型
    const typeClass = Reflect.getMetadata("design:type", target, propertyKey);
    const descriptor = descriptorOf(target, propertyKey) || {
      configurable: true,
      writable: true,
    };
    // 实例化修饰类
    descriptor.value = params ? new typeClass(params) : new typeClass();
    Reflect.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor,
    );
  };
};

export function Mutations(namespace?: string) {
  // component options should be passed to the callback
  // and update for the options object affect the component

  // tslint:disable-next-line:only-arrow-functions
  return function(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    const name = namespace ? namespace + "/" + methodName : methodName;
    descriptor.value = function commit() {
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      if (original.apply(this, args) !== false) {
        (this as any).$store.commit.apply(this, [name].concat(args));
      }
    };
  };
}
