import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AvailabilityResponse } from '../types/availability';
import { fetchAvailability } from '../services/availabilityService';

interface DataState {
  hasData: boolean;
  projectsByMonth: any;
  parsedExcelRawData: any[] | null;
  projectNames: string[];
  activeProjectName: string | null;
  availabilityData: AvailabilityResponse | null;
  isLoadingAvailability: boolean;
  setUploadData: (data: any, rawData?: any[], projectNames?: string[]) => void;
  setActiveProjectName: (name: string | null) => void;
  fetchAvailabilityData: (projectId: string) => Promise<void>;
  resetData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      hasData: false,
      projectsByMonth: {},
      parsedExcelRawData: null,
      projectNames: [],
      activeProjectName: null,
      availabilityData: null,
      isLoadingAvailability: false,
      setUploadData: (data, rawData, projectNames) => {
        const names = projectNames || [];
        const activeName = names.length > 0 ? names[0] : null;
        set({ 
          hasData: true, 
          projectsByMonth: data, 
          parsedExcelRawData: rawData || null,
          projectNames: names,
          activeProjectName: activeName
        });
        
        // Trigger availability fetch if we have an active project
        if (activeName) {
          get().fetchAvailabilityData(activeName);
        }
      },
      setActiveProjectName: (name) => {
        set({ activeProjectName: name });
        if (name) {
          get().fetchAvailabilityData(name);
        }
      },
      fetchAvailabilityData: async (projectId) => {
        set({ isLoadingAvailability: true });
        try {
          const data = await fetchAvailability(projectId);
          set({ availabilityData: data, isLoadingAvailability: false });
        } catch (error: any) {
          const msg = error?.message || '';
          // Resetear availabilityData en TODOS los casos de error para estado consistente
          set({ availabilityData: null, isLoadingAvailability: false });
          // Loguear todos los errores excepto el 404 esperado (sin archivo cargado)
          if (!msg.includes('404') && !msg.includes('No se ha cargado')) {
            console.error('[dataStore] Error fetching availability:', msg);
          }
        }
      },
      resetData: () => set({ 
        hasData: false, 
        projectsByMonth: {}, 
        parsedExcelRawData: null,
        projectNames: [],
        activeProjectName: null,
        availabilityData: null
      }),
    }),

    {
      name: 'excel-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
