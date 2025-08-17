import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../state/store';
import { setSelection, toggleSelection } from '../state/sceneSlice';

const HierarchyPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { objects, selectedObjects } = useSelector((state: RootState) => state.scene);

  const handleSelect = (event: React.MouseEvent, id: string) => {
    console.log('Item clicked:', id);
    if (event.ctrlKey || event.metaKey) {
      dispatch(toggleSelection(id));
    } else {
      dispatch(setSelection([id]));
    }
  };

  return (
    <div className="h-full w-full bg-gray-800 p-2 overflow-auto text-white">
      <h2 className="text-lg font-bold mb-2 border-b border-gray-700 pb-2">Hierarchy</h2>
      <ul>
        {Object.values(objects).map(obj => (
          <li
            key={obj.id}
            onClick={(e) => handleSelect(e, obj.id)}
            className={`p-1 cursor-pointer rounded ${
              selectedObjects.includes(obj.id) ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            {obj.name} ({obj.id.substring(0, 8)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HierarchyPanel;
