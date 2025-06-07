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

// Specific support for contentlayer generated files
declare module "./.contentlayer/generated/Post/_index.json" {
  const value: any;
  export default value;
}
