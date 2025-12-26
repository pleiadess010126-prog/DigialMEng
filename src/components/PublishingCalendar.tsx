'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    platform: 'wordpress' | 'youtube' | 'instagram' | 'facebook';
    status: 'scheduled' | 'published' | 'draft';
    scheduledFor: Date;
}

export default function PublishingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events] = useState<CalendarEvent[]>([
        {
            id: '1',
            title: 'Digital Marketing Guide',
            platform: 'wordpress',
            status: 'scheduled',
            scheduledFor: new Date(2025, 11, 27, 10, 0),
        },
        {
            id: '2',
            title: 'SEO Tips Short',
            platform: 'youtube',
            status: 'scheduled',
            scheduledFor: new Date(2025, 11, 28, 14, 0),
        },
        {
            id: '3',
            title: 'Marketing Hacks Reel',
            platform: 'instagram',
            status: 'scheduled',
            scheduledFor: new Date(2025, 11, 29, 16, 0),
        },
    ]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = event.scheduledFor;
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const platformColors = {
        wordpress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
        instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        facebook: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };

    return (
        <div className="card">
            <div className="card-header flex-row items-center justify-between pb-4">
                <div>
                    <h3 className="card-title flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Publishing Calendar
                    </h3>
                    <p className="card-description mt-1">
                        Scheduled content across all platforms
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={previousMonth} className="btn-ghost btn-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold min-w-[120px] text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="btn-ghost btn-sm">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="card-content">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const dayEvents = getEventsForDay(day);
                        const isToday =
                            day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={`aspect-square p-1 rounded-lg border border-border/50 ${isToday ? 'bg-primary/10 border-primary/30' : 'bg-muted/20'
                                    } relative`}
                            >
                                <div className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                                    {day}
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {dayEvents.slice(0, 2).map(event => (
                                        <div
                                            key={event.id}
                                            className={`text-[8px] px-1 rounded border ${platformColors[event.platform]} truncate`}
                                            title={event.title}
                                        >
                                            {event.platform[0].toUpperCase()}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-[8px] text-muted-foreground px-1">
                                            +{dayEvents.length - 2}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
                        <span className="text-xs text-muted-foreground">WordPress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                        <span className="text-xs text-muted-foreground">YouTube</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500/30" />
                        <span className="text-xs text-muted-foreground">Instagram</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500/30" />
                        <span className="text-xs text-muted-foreground">Facebook</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
