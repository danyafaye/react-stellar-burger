import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import {
  moveIngredient,
  removeIngredient,
  type TOrderIngredient,
} from '@services/order/slice.ts';
import { DND_TYPES } from '@utils/constants.ts';

import type { Identifier } from 'dnd-core';
import type { FC } from 'react';

import styles from './draggable-constructor-item.module.css';

type DraggableConstructorItemProps = {
  ingredient: TOrderIngredient;
  index: number;
};

type DragItem = {
  index: number;
  uniqueId: string;
  type: string;
};

type DropCollectedProps = {
  handlerId: Identifier | null;
};

type DragCollectedProps = {
  isDragging: boolean;
};

export const DraggableConstructorItem: FC<DraggableConstructorItemProps> = ({
  ingredient,
  index,
}) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, DropCollectedProps>({
    accept: DND_TYPES.CONSTRUCTOR_INGREDIENT,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dispatch(moveIngredient({ dragIndex, hoverIndex }));

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, DragCollectedProps>({
    type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
    item: () => {
      return {
        uniqueId: ingredient.uniqueId,
        index,
        type: DND_TYPES.CONSTRUCTOR_INGREDIENT,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleRemove = () => {
    dispatch(removeIngredient(ingredient.uniqueId));
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${styles.constructor_item} ${isDragging ? styles.dragging : ''}`}
      data-handler-id={handlerId}
    >
      <DragIcon type="primary" className={styles.drag_icon} />
      <ConstructorElement
        text={ingredient.name}
        thumbnail={ingredient.image_mobile}
        price={ingredient.price}
        handleClose={handleRemove}
      />
    </div>
  );
};
