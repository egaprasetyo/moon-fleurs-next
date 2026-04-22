export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AnyTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      [tableName: string]: AnyTable;
    };
    Views: {
      [viewName: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [fnName: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [enumName: string]: string;
    };
    CompositeTypes: {
      [typeName: string]: Record<string, unknown>;
    };
  };
};
