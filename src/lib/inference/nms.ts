/**
 * Non-Maximum Suppression (NMS) Algorithm
 * Filters overlapping bounding boxes to keep only the highest confidence detections
 */

import type { RawDetection, BoundingBox } from "./types";
import { INFERENCE_CONFIG } from "@/lib/constants";

/**
 * Confusion groups: classes the model often confuses.
 * Cross-class NMS is applied within each group.
 */
const CONFUSION_GROUPS: number[][] = [
  [3, 4, 5, 23], // chicken (3), pork (4), steak (5), fried_meat (23) — meat confusion
  [6, 7], // fish (6), shrimp (7) — seafood confusion
  [10, 11], // noodles (10), pasta (11) — noodle confusion
  [19, 20, 24], // spinach (19), cabbage (20), salad (24) — leafy greens confusion
];

/**
 * Apply Non-Maximum Suppression to filter overlapping detections
 * @param detections - Array of raw detections from YOLO output
 * @param confThreshold - Minimum confidence score (default: 0.25)
 * @param iouThreshold - Maximum IoU for overlap (default: 0.45)
 * @returns Filtered detections with overlaps removed
 */
export function applyNMS(
  detections: RawDetection[],
  confThreshold: number = INFERENCE_CONFIG.CONFIDENCE_THRESHOLD,
  iouThreshold: number = INFERENCE_CONFIG.IOU_THRESHOLD,
): RawDetection[] {
  // Step 1: Filter by confidence threshold
  const filtered = detections.filter((d) => d.confidence >= confThreshold);

  if (filtered.length === 0) {
    return [];
  }

  // Step 2: Sort by confidence (descending - highest first)
  filtered.sort((a, b) => b.confidence - a.confidence);

  // Step 3: Apply per-class NMS — suppress same-class overlapping boxes
  const result: RawDetection[] = [];
  const suppressed = new Set<number>();

  for (let i = 0; i < filtered.length; i++) {
    if (suppressed.has(i)) continue;

    const currentDetection = filtered[i];
    result.push(currentDetection);

    for (let j = i + 1; j < filtered.length; j++) {
      if (suppressed.has(j)) continue;

      const otherDetection = filtered[j];

      if (currentDetection.classId === otherDetection.classId) {
        const iou = calculateIoU(currentDetection.box, otherDetection.box);
        if (iou > iouThreshold) {
          suppressed.add(j);
        }
      }
    }
  }

  // Step 4: Cross-class NMS for confusion groups (e.g. steak vs pork)
  // If two detections from the same confusion group overlap, keep the higher confidence one
  return applyCrossClassNMS(result, iouThreshold);
}

/**
 * Cross-class NMS: suppress lower-confidence detections from confusion groups
 * when they significantly overlap a higher-confidence detection in the same group.
 */
function applyCrossClassNMS(
  detections: RawDetection[],
  iouThreshold: number,
): RawDetection[] {
  // Build a set of class IDs that belong to any confusion group
  const classToGroup = new Map<number, number>();
  CONFUSION_GROUPS.forEach((group, groupIdx) => {
    for (const classId of group) {
      classToGroup.set(classId, groupIdx);
    }
  });

  // Already sorted by confidence (descending) from previous step
  const kept: RawDetection[] = [];
  const suppressed = new Set<number>();

  for (let i = 0; i < detections.length; i++) {
    if (suppressed.has(i)) continue;
    kept.push(detections[i]);

    const groupI = classToGroup.get(detections[i].classId);
    if (groupI === undefined) continue; // not in any confusion group

    for (let j = i + 1; j < detections.length; j++) {
      if (suppressed.has(j)) continue;

      const groupJ = classToGroup.get(detections[j].classId);
      // Same confusion group but different class
      if (
        groupJ === groupI &&
        detections[j].classId !== detections[i].classId
      ) {
        const iou = calculateIoU(detections[i].box, detections[j].box);
        if (iou > iouThreshold) {
          suppressed.add(j);
        }
      }
    }
  }

  return kept;
}

/**
 * Calculate Intersection over Union (IoU) for two bounding boxes
 * @param box1 - First bounding box (center format)
 * @param box2 - Second bounding box (center format)
 * @returns IoU score (0-1, where 1 = perfect overlap)
 */
export function calculateIoU(box1: BoundingBox, box2: BoundingBox): number {
  // Convert from center format (x, y, w, h) to corner format (xmin, ymin, xmax, ymax)
  const x1_min = box1.x - box1.width / 2;
  const y1_min = box1.y - box1.height / 2;
  const x1_max = box1.x + box1.width / 2;
  const y1_max = box1.y + box1.height / 2;

  const x2_min = box2.x - box2.width / 2;
  const y2_min = box2.y - box2.height / 2;
  const x2_max = box2.x + box2.width / 2;
  const y2_max = box2.y + box2.height / 2;

  // Calculate intersection area
  const inter_x_min = Math.max(x1_min, x2_min);
  const inter_y_min = Math.max(y1_min, y2_min);
  const inter_x_max = Math.min(x1_max, x2_max);
  const inter_y_max = Math.min(y1_max, y2_max);

  const inter_width = Math.max(0, inter_x_max - inter_x_min);
  const inter_height = Math.max(0, inter_y_max - inter_y_min);
  const inter_area = inter_width * inter_height;

  // Calculate union area
  const box1_area = box1.width * box1.height;
  const box2_area = box2.width * box2.height;
  const union_area = box1_area + box2_area - inter_area;

  // Avoid division by zero
  if (union_area === 0) {
    return 0;
  }

  // Return IoU
  return inter_area / union_area;
}

/**
 * Utility function to validate bounding box coordinates
 * @param box - Bounding box to validate
 * @returns true if box is valid
 */
export function isValidBox(box: BoundingBox): boolean {
  return (
    box.x >= 0 &&
    box.x <= 1 &&
    box.y >= 0 &&
    box.y <= 1 &&
    box.width > 0 &&
    box.width <= 1 &&
    box.height > 0 &&
    box.height <= 1
  );
}
