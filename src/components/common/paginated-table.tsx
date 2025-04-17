import React, { useMemo } from "react";
import { Table, TableProps, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";

interface PaginationData {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ColumnConfig<T> {
  title: string;
  key: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: string | number | boolean }[];
  onFilter?: (value: any, record: T) => boolean;
  width?: number | string;
  align?: "left" | "right" | "center";
  fixed?: "left" | "right" | boolean;
  ellipsis?: boolean;
}

export interface PaginatedTableProps<T> {
  data?: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  pagination?: PaginationData;
  rowKey?: string | ((record: T) => string);
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showSizeChanger?: boolean;
  tableProps?: Omit<
    TableProps<T>,
    "columns" | "dataSource" | "loading" | "pagination" | "rowKey"
  >;
}

function PaginatedTable<T extends Record<string, any>>({
  data = [],
  columns,
  loading = false,
  pagination,
  rowKey = "id",
  onPageChange,
  onPageSizeChange,
  className,
  showSizeChanger = false,
  tableProps,
}: PaginatedTableProps<T>) {
  // Convert column config to Ant Design's column format
  const tableColumns = useMemo<ColumnsType<T>>(() => {
    return columns.map((column) => {
      const { key, ...rest } = column;
      return {
        key,
        ...rest,
      };
    });
  }, [columns]);

  // Set up pagination config for Ant Design Table
  const paginationConfig = useMemo(() => {
    if (!pagination) return false;

    return {
      current: pagination.page,
      pageSize: pagination.limit,
      total: pagination.totalDocs,
      showSizeChanger,
      onChange: onPageChange,
      onShowSizeChange: (_: number, size: number) => {
        onPageSizeChange?.(size);
      },
      showTotal: (total: number, range: [number, number]) =>
        `${range[0]}-${range[1]} of ${total} items`,
    };
  }, [pagination, onPageChange, onPageSizeChange, showSizeChanger]);

  return (
    <div className={className}>
      <Table
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey={rowKey}
        {...tableProps}
      />

      {pagination && (
        <div className="mt-4 flex justify-end">
          <Pagination {...paginationConfig} />
        </div>
      )}
    </div>
  );
}

export default PaginatedTable;
