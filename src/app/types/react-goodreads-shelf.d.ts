declare module "react-goodreads-shelf" {
    import { Component, ReactNode } from "react";  // Import necessary types
  
    interface GoodreadsBookshelfProps {
      userId: string;                // Required prop for user ID
      width?: number | string;       // Optional props for styling
      height?: number | string;
      exclude?: string[];           // Array of shelves to exclude
      limit?: number;               // Limit the number of books displayed
      coverSize?: "small" | "medium"; // Control cover image size
      children?: ReactNode;          // Allow child elements
    }
  
    class GoodreadsBookshelf extends Component<GoodreadsBookshelfProps> {}
  
    export default GoodreadsBookshelf;  
  }
  