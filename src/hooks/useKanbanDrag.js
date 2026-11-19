import { useState, useRef, useCallback } from 'react';

export function useKanbanDrag(initialKanban) {
  const [kanban, setKanban] = useState(initialKanban);
  const [dragging, setDragging] = useState(null); // { taskId, fromCol }
  const [overCol, setOverCol] = useState(null);

  const startDrag = useCallback((taskId, fromCol) => {
    setDragging({ taskId, fromCol });
  }, []);

  const enterCol = useCallback((colId) => {
    setOverCol(colId);
  }, []);

  const drop = useCallback((toCol) => {
    if (!dragging || !toCol || dragging.fromCol === toCol) {
      setDragging(null);
      setOverCol(null);
      return;
    }
    const { taskId, fromCol } = dragging;
    const task = kanban[fromCol]?.find(t => t.id === taskId);
    if (!task) return;
    setKanban(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
      [toCol]: [...(prev[toCol] || []), task],
    }));
    setDragging(null);
    setOverCol(null);
  }, [dragging, kanban]);

  const cancel = useCallback(() => {
    setDragging(null);
    setOverCol(null);
  }, []);

  return { kanban, setKanban, dragging, overCol, startDrag, enterCol, drop, cancel };
}
