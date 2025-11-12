import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ColorSwatch } from './ColorSwatch';

interface DraggableColorSwatchProps {
  color: string;
  index: number;
  onRemove: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  showRemove?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const ITEM_TYPE = 'COLOR_SWATCH';

export function DraggableColorSwatch({
  color,
  index,
  onRemove,
  onMove,
  showRemove = true,
  onClick,
  isSelected = false,
}: DraggableColorSwatchProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${isOver ? 'scale-105' : ''}`}
      style={{ cursor: 'move' }}
    >
      <ColorSwatch 
        color={color} 
        onRemove={onRemove} 
        showRemove={showRemove} 
        onClick={onClick}
        isSelected={isSelected}
      />
    </div>
  );
}