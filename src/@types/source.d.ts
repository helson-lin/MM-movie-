export interface SOURCES {
   name: string;
   url: string;
}
export interface PlayItem {
    name: string;
    url: string;
  }
  
export interface Storage {
    [key: string]: PlayItem[];
  }