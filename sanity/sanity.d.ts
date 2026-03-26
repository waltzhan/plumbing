declare module 'sanity' {
  export function defineType(config: any): any;
  export function defineField(config: any): any;
  export function defineArrayMember(config: any): any;
}

declare module 'sanity/desk' {
  export function deskTool(): any;
}

declare module '@sanity/vision' {
  export function visionTool(): any;
}
