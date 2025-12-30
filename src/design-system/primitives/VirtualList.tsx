/**
 * VirtualList Component
 *
 * High-performance virtualized list using @tanstack/react-virtual.
 * Only renders visible items plus overscan buffer for smooth scrolling.
 * Essential for lists with 50+ items to maintain 60fps performance.
 *
 * @component
 * @example
 * // Basic usage
 * <VirtualList
 *   items={users}
 *   itemHeight={60}
 *   renderItem={(user) => <UserRow user={user} />}
 * />
 *
 * @example
 * // With custom height and key extractor
 * <VirtualList
 *   items={messages}
 *   itemHeight={80}
 *   height={600}
 *   getItemKey={(msg) => msg.id}
 *   renderItem={(msg, index) => (
 *     <MessageBubble message={msg} isFirst={index === 0} />
 *   )}
 * />
 *
 * @example
 * // With gap between items and empty state
 * <VirtualList
 *   items={notifications}
 *   itemHeight={72}
 *   gap={8}
 *   emptyState={<EmptyNotifications />}
 *   renderItem={(notification) => (
 *     <NotificationCard notification={notification} />
 *   )}
 * />
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /**
   * Height of each item in pixels.
   * Must be consistent for all items (use VirtualGrid for variable heights).
   */
  itemHeight: number;
  /**
   * Container height. Accepts number (pixels) or CSS string.
   * @default 400
   */
  height?: number | string;
  /**
   * Render function called for each visible item.
   * @param item - The item data
   * @param index - The item's index in the array
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Function to extract unique key for each item.
   * Improves performance by enabling React reconciliation.
   */
  getItemKey?: (item: T, index: number) => string | number;
  /**
   * Number of items to render outside visible area.
   * Higher values = smoother scrolling but more DOM nodes.
   * @default 5
   */
  overscan?: number;
  /** Additional CSS classes for the scroll container */
  className?: string;
  /**
   * Gap between items in pixels.
   * @default 0
   */
  gap?: number;
  /**
   * Component to render when items array is empty.
   * If not provided, renders nothing when empty.
   */
  emptyState?: React.ReactNode;
}

export function VirtualList<T>({
  items,
  itemHeight,
  height = 400,
  renderItem,
  getItemKey,
  overscan = 5,
  className = '',
  gap = 0,
  emptyState,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan,
    getItemKey: getItemKey ? index => getItemKey(items[index], index) : undefined,
  });

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size - gap}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * VirtualGrid Component
 *
 * Virtualized grid layout for product cards and similar items.
 * Renders items in a responsive grid while only mounting visible rows.
 * Ideal for e-commerce product listings, image galleries, and card grids.
 *
 * @component
 * @example
 * // Product grid
 * <VirtualGrid
 *   items={products}
 *   columns={3}
 *   rowHeight={320}
 *   renderItem={(product) => <ProductCard product={product} />}
 * />
 *
 * @example
 * // Image gallery with gap
 * <VirtualGrid
 *   items={images}
 *   columns={4}
 *   rowHeight={200}
 *   gap={12}
 *   getItemKey={(img) => img.id}
 *   renderItem={(img) => (
 *     <Image src={img.url} alt={img.title} aspectRatio="1/1" />
 *   )}
 * />
 *
 * @example
 * // With empty state
 * <VirtualGrid
 *   items={searchResults}
 *   columns={3}
 *   rowHeight={280}
 *   emptyState={<NoResultsFound query={searchQuery} />}
 *   renderItem={(result) => <ResultCard result={result} />}
 * />
 */
export interface VirtualGridProps<T> {
  /** Array of items to render */
  items: T[];
  /**
   * Number of columns in the grid.
   * Items wrap to next row automatically.
   */
  columns: number;
  /**
   * Height of each row in pixels.
   * All rows have the same height.
   */
  rowHeight: number;
  /**
   * Container height. Accepts number (pixels) or CSS string.
   * @default 600
   */
  height?: number | string;
  /**
   * Render function called for each visible item.
   * @param item - The item data
   * @param index - The item's index in the array
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Function to extract unique key for each item.
   * Improves performance by enabling React reconciliation.
   */
  getItemKey?: (item: T, index: number) => string | number;
  /**
   * Number of rows to render outside visible area.
   * @default 3
   */
  overscan?: number;
  /** Additional CSS classes for the scroll container */
  className?: string;
  /**
   * Gap between items in pixels (both horizontal and vertical).
   * @default 16
   */
  gap?: number;
  /**
   * Component to render when items array is empty.
   * If not provided, renders nothing when empty.
   */
  emptyState?: React.ReactNode;
}

export function VirtualGrid<T>({
  items,
  columns,
  rowHeight,
  height = 600,
  renderItem,
  getItemKey,
  overscan = 3,
  className = '',
  gap = 16,
  emptyState,
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight + gap,
    overscan,
  });

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const rowIndex = virtualRow.index;
          const startIndex = rowIndex * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
                paddingBottom: `${gap}px`,
              }}
            >
              {rowItems.map((item, colIndex) => {
                const itemIndex = startIndex + colIndex;
                const key = getItemKey ? getItemKey(item, itemIndex) : itemIndex;
                return <div key={key}>{renderItem(item, itemIndex)}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualList;
