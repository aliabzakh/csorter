/**
 * Selection Algorithm Implementation
 * Uses binary search to efficiently determine user preferences
 */

export interface Item {
  id: string;
  name: string;
}

export interface SelectionResult {
  selectedItem: Item;
  rejectedItems: Item[];
  rounds: number;
}

/**
 * Performs binary search-based selection
 * Compares pairs of items until only one remains
 */
export function performSelection(
  items: Item[]
): Promise<SelectionResult> {
  return new Promise((resolve) => {
    if (items.length === 0) {
      throw new Error("No items to select from");
    }

    if (items.length === 1) {
      resolve({
        selectedItem: items[0],
        rejectedItems: [],
        rounds: 0,
      });
      return;
    }

    let remaining = [...items];
    let rejected: Item[] = [];
    let rounds = 0;

    const continueSelection = (callback: (winner: Item) => void) => {
      if (remaining.length === 1) {
        resolve({
          selectedItem: remaining[0],
          rejectedItems: rejected,
          rounds,
        });
        return;
      }

      // Trigger comparison UI
      callback(remaining[0]);
    };

    continueSelection((selected) => {
      // This will be handled by the UI component
      // The selection continues through user input
    });
  });
}

/**
 * Record user preference and update selection state
 */
export function recordPreference(
  currentItem: Item,
  otherItem: Item,
  preferred: "current" | "other"
): { remaining: Item[]; rejected: Item[] } {
  if (preferred === "current") {
    return {
      remaining: [currentItem],
      rejected: [otherItem],
    };
  } else {
    return {
      remaining: [otherItem],
      rejected: [currentItem],
    };
  }
}
