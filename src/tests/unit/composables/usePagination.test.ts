import { describe, it, expect, beforeEach } from 'vitest';
import { usePagination } from '../../../composables/usePagination';

describe('usePagination', () => {
  let pagination: ReturnType<typeof usePagination>;

  beforeEach(() => {
    pagination = usePagination();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(pagination.currentPage.value).toBe(1);
      expect(pagination.itemsPerPage.value).toBe(12);
      expect(pagination.totalItemsCount.value).toBe(0);
      expect(pagination.totalPages.value).toBe(0);
      expect(pagination.hasNext.value).toBe(false);
      expect(pagination.hasPrev.value).toBe(false);
      expect(pagination.startIndex.value).toBe(0);
      expect(pagination.endIndex.value).toBe(0);
      expect(pagination.getPageNumbers()).toEqual([]);
    });

    it('should initialize with custom values', () => {
      const customPagination = usePagination({
        initialPage: 3,
        initialItemsPerPage: 20,
        totalItems: 100
      });

      expect(customPagination.currentPage.value).toBe(3);
      expect(customPagination.itemsPerPage.value).toBe(20);
      expect(customPagination.totalItemsCount.value).toBe(100);
      expect(customPagination.totalPages.value).toBe(5);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      pagination = usePagination({
        initialPage: 3,
        initialItemsPerPage: 10,
        totalItems: 50
      });
    });

    it('should go to next page', () => {
      expect(pagination.currentPage.value).toBe(3);
      expect(pagination.hasNext.value).toBe(true);

      pagination.nextPage();

      expect(pagination.currentPage.value).toBe(4);
    });

    it('should go to previous page', () => {
      expect(pagination.currentPage.value).toBe(3);
      expect(pagination.hasPrev.value).toBe(true);

      pagination.prevPage();

      expect(pagination.currentPage.value).toBe(2);
    });

    it('should go to specific page', () => {
      pagination.setPage(5);

      expect(pagination.currentPage.value).toBe(5);
    });

    it('should go to first page', () => {
      pagination.firstPage();

      expect(pagination.currentPage.value).toBe(1);
    });

    it('should go to last page', () => {
      pagination.lastPage();

      expect(pagination.currentPage.value).toBe(5);
    });

    it('should not go beyond first page', () => {
      pagination.firstPage();
      pagination.prevPage();

      expect(pagination.currentPage.value).toBe(1);
    });

    it('should not go beyond last page', () => {
      pagination.lastPage();
      pagination.nextPage();

      expect(pagination.currentPage.value).toBe(5);
    });

    it('should not go to invalid page', () => {
      pagination.setPage(0);
      expect(pagination.currentPage.value).toBe(3); // Should not change

      pagination.setPage(10);
      expect(pagination.currentPage.value).toBe(3); // Should not change
    });
  });

  describe('computed properties', () => {
    it('should calculate total pages correctly', () => {
      pagination = usePagination({
        initialItemsPerPage: 10,
        totalItems: 25
      });

      expect(pagination.totalPages.value).toBe(3);
    });

    it('should calculate total pages with exact division', () => {
      pagination = usePagination({
        initialItemsPerPage: 10,
        totalItems: 30
      });

      expect(pagination.totalPages.value).toBe(3);
    });

    it('should calculate total pages with remainder', () => {
      pagination = usePagination({
        initialItemsPerPage: 10,
        totalItems: 25
      });

      expect(pagination.totalPages.value).toBe(3);
    });

    it('should calculate hasNext correctly', () => {
      pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
        totalItems: 25
      });

      expect(pagination.hasNext.value).toBe(true);

      pagination.lastPage();
      expect(pagination.hasNext.value).toBe(false);
    });

    it('should calculate hasPrev correctly', () => {
      pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
        totalItems: 25
      });

      expect(pagination.hasPrev.value).toBe(false);

      pagination.nextPage();
      expect(pagination.hasPrev.value).toBe(true);
    });

    it('should calculate start and end index correctly', () => {
      pagination.setTotalItems(25);
      pagination.setItemsPerPage(10);
      pagination.setPage(2);

      expect(pagination.startIndex.value).toBe(10);
      expect(pagination.endIndex.value).toBe(20);
    });

    it('should calculate start and end index for last page', () => {
      pagination.setTotalItems(25);
      pagination.setItemsPerPage(10);
      pagination.setPage(3);

      expect(pagination.startIndex.value).toBe(20);
      expect(pagination.endIndex.value).toBe(25);
    });

    it('should calculate page numbers correctly', () => {
      pagination = usePagination({
        initialPage: 3,
        initialItemsPerPage: 10,
        totalItems: 50
      });

      expect(pagination.getPageNumbers()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should calculate page numbers with max display', () => {
      const customPagination = usePagination({
        initialPage: 5,
        initialItemsPerPage: 10,
        totalItems: 100
      });

      expect(customPagination.getPageNumbers(3)).toEqual([4, 5, 6]);
    });

    it('should calculate page numbers at start', () => {
      const customPagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
        totalItems: 100
      });

      expect(customPagination.getPageNumbers(3)).toEqual([1, 2, 3]);
    });

    it('should calculate page numbers at end', () => {
      const customPagination = usePagination({
        initialPage: 10,
        initialItemsPerPage: 10,
        totalItems: 100
      });

      expect(customPagination.getPageNumbers(3)).toEqual([8, 9, 10]);
    });
  });

  describe('updating values', () => {
    it('should update current page', () => {
      pagination.setTotalItems(30);
      pagination.setItemsPerPage(10);

      pagination.setPage(3);

      expect(pagination.currentPage.value).toBe(3);
    });

    it('should update items per page', () => {
      pagination.setItemsPerPage(20);

      expect(pagination.itemsPerPage.value).toBe(20);
      expect(pagination.currentPage.value).toBe(1); // Reset to first page
    });

    it('should update total items', () => {
      pagination.setTotalItems(100);

      expect(pagination.totalItemsCount.value).toBe(100);
      expect(pagination.totalPages.value).toBe(9); // 100/12 = 9 pages
    });

    it('should respect max items per page', () => {
      pagination.setItemsPerPage(150); // Should be capped at maxItemsPerPage (100)

      expect(pagination.itemsPerPage.value).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle zero total items', () => {
      pagination = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
        totalItems: 0
      });

      expect(pagination.totalPages.value).toBe(0);
      expect(pagination.hasNext.value).toBe(false);
      expect(pagination.hasPrev.value).toBe(false);
      expect(pagination.startIndex.value).toBe(0);
      expect(pagination.endIndex.value).toBe(0);
    });

    it('should handle negative values', () => {
      pagination = usePagination({
        initialPage: -1,
        initialItemsPerPage: -5,
        totalItems: -10
      });

      expect(pagination.currentPage.value).toBe(-1);
      expect(pagination.itemsPerPage.value).toBe(-5);
      expect(pagination.totalItemsCount.value).toBe(-10);
    });

    it('should handle very large numbers', () => {
      pagination = usePagination({
        initialPage: 1000,
        initialItemsPerPage: 100,
        totalItems: 1000000
      });

      expect(pagination.currentPage.value).toBe(1000);
      expect(pagination.totalPages.value).toBe(10000);
    });
  });

  describe('reset functionality', () => {
    it('should reset to default values', () => {
      pagination = usePagination({
        initialPage: 5,
        initialItemsPerPage: 20,
        totalItems: 100
      });

      pagination.reset();

      expect(pagination.currentPage.value).toBe(5);
      expect(pagination.itemsPerPage.value).toBe(20);
      expect(pagination.totalItemsCount.value).toBe(100);
    });
  });

  describe('page info', () => {
    it('should get page info', () => {
      pagination = usePagination({
        initialPage: 2,
        initialItemsPerPage: 10,
        totalItems: 25
      });

      const pageInfo = pagination.pageInfo.value;

      expect(pageInfo).toEqual({
        currentPage: 2,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        startIndex: 10,
        endIndex: 20,
        hasNext: true,
        hasPrev: true
      });
    });
  });

  describe('paginate items', () => {
    it('should paginate array of items', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      
      pagination = usePagination({
        initialPage: 2,
        initialItemsPerPage: 10,
        totalItems: 25
      });

      const paginatedItems = pagination.paginateItems(items);

      expect(paginatedItems).toHaveLength(10);
      expect(paginatedItems[0].id).toBe(10);
      expect(paginatedItems[9].id).toBe(19);
    });

    it('should handle empty array', () => {
      const items: any[] = [];
      
      pagination = usePagination({
        initialItemsPerPage: 10,
        totalItems: 0
      });

      const paginatedItems = pagination.paginateItems(items);

      expect(paginatedItems).toEqual([]);
    });
  });
}); 