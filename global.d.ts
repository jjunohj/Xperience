// JSON import assertions support
declare module "*.json" {
  const value: any;
  export default value;
}

// Import assertions with type
declare module "*" {
  const value: any;
  export default value;
}

