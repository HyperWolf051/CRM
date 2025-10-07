import { useState, memo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DealCard from './DealCard';

const DEAL_STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-100 border-gray-300' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-50 border-blue-300' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-50 border-yellow-300' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-50 border-orange-300' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-green-50 border-green-300' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-50 border-red-300' },
];

function DroppableColumn({ stage, deals, children }) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: stage.id,
    data: {
      type: 'column',
      stage: stage.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 lg:w-80 xl:w-80 ${stage.color} rounded-lg border-2 border-dashed transition-all duration-150 hover:shadow-md transform hover:scale-[1.02] ${
        isOver ? 'border-primary-400 bg-primary-50 shadow-lg scale-[1.02]' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900" id={`stage-${stage.id}-title`}>
            {stage.name}
          </h3>
          <span 
            className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full"
            aria-label={`${deals.length} deals in ${stage.name}`}
          >
            {deals.length}
          </span>
        </div>
        <div 
          className="space-y-3 min-h-[200px]"
          role="list"
          aria-labelledby={`stage-${stage.id}-title`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SortableDealCard({ deal, onDealClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: 'deal',
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
      role="listitem"
      aria-label={`Deal: ${deal.name}, Value: ${deal.value}, Stage: ${deal.stage}`}
      tabIndex={0}
    >
      <DealCard deal={deal} onClick={() => onDealClick(deal)} />
    </div>
  );
}

const KanbanBoard = memo(function KanbanBoard({ deals = [], onDealMove, onDealClick, loading = false }) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter(deal => deal.stage === stage.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeContainer = active.data.current?.stage || findContainer(activeId);
    const overContainer = over.data.current?.stage || findContainer(overId) || overId;

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    // Move deal to new stage
    const activeDeal = deals.find(deal => deal.id === activeId);
    if (activeDeal && onDealMove) {
      onDealMove(activeDeal.id, overContainer);
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const findContainer = (id) => {
    for (const stage of DEAL_STAGES) {
      if (dealsByStage[stage.id]?.find(deal => deal.id === id)) {
        return stage.id;
      }
    }
    return null;
  };

  const activeDeal = activeId ? deals.find(deal => deal.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth">
        {DEAL_STAGES.map((stage) => (
          <div key={stage.id} className={`flex-shrink-0 w-72 lg:w-80 xl:w-80 ${stage.color} rounded-lg border-2 border-dashed`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
                <div className="h-6 w-8 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
        role="application"
        aria-label="Deals kanban board"
      >
        {DEAL_STAGES.map((stage) => (
          <SortableContext
            key={stage.id}
            id={stage.id}
            items={dealsByStage[stage.id]?.map(deal => deal.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <DroppableColumn stage={stage} deals={dealsByStage[stage.id] || []}>
              {dealsByStage[stage.id]?.map((deal) => (
                <SortableDealCard
                  key={deal.id}
                  deal={deal}
                  onDealClick={onDealClick}
                />
              ))}
            </DroppableColumn>
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <DealCard deal={activeDeal} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

export default KanbanBoard;