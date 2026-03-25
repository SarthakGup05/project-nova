'use client';

import React from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';

export default function CalendarPage() {
  return (
    <div className="w-full h-full p-2 sm:p-6 pb-24 sm:pb-6">
       <CalendarView />
    </div>
  );
}
