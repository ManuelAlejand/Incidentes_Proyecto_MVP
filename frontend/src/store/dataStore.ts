import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DataState {
  hasData: boolean;
  projectsByMonth: any;
  parsedExcelRawData: any[] | null;
  projectNames: string[];
  activeProjectName: string | null;
  setUploadData: (data: any, rawData?: any[], projectNames?: string[]) => void;
  setActiveProjectName: (name: string | null) => void;
  resetData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      hasData: false,
      projectsByMonth: {},
      parsedExcelRawData: null,
      projectNames: [],
      activeProjectName: null,
      setUploadData: (data, rawData, projectNames) => set({ 
        hasData: true, 
        projectsByMonth: data, 
        parsedExcelRawData: rawData || null,
        projectNames: projectNames || [],
        activeProjectName: projectNames && projectNames.length > 0 ? projectNames[0] : null
      }),
      setActiveProjectName: (name) => set({ activeProjectName: name }),
      resetData: () => set({ 
        hasData: false, 
        projectsByMonth: {}, 
        parsedExcelRawData: null,
        projectNames: [],
        activeProjectName: null
      }),
    }),
    {
      name: 'excel-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
