/**
 * Minimal Theme Example Component
 * 
 * This file demonstrates all the key features of the minimal human-crafted UI theme.
 * Use this as a reference when building new components.
 */

import { Users, Briefcase, Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react';

export default function MinimalThemeExample() {
  return (
    <div className="p-23 space-y-23 bg-minimal-off-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-29">
          <h1 className="text-3xl font-bold text-minimal-text-black mb-13">
            Minimal Theme Examples
          </h1>
          <p className="text-minimal-text-medium italic">
            A showcase of the minimal human-crafted UI theme components and patterns.
          </p>
        </div>

        {/* Section 1: Cards */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            1. Minimal Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-17">
            {/* Basic Card */}
            <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card hover:shadow-minimal-elevated transition-shadow duration-150 p-17">
              <h3 className="text-sm font-medium text-minimal-text-medium mb-13">
                Basic Card
              </h3>
              <p className="text-2xl font-bold text-minimal-text-dark mb-2">
                156
              </p>
              <p className="text-xs text-minimal-text-light italic">
                Subtle shadow, no colors
              </p>
            </div>

            {/* Card with Icon */}
            <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card hover:shadow-minimal-elevated transition-shadow duration-150 p-17">
              <div className="flex items-center justify-between mb-13">
                <h3 className="text-sm font-medium text-minimal-text-medium">
                  With Icon
                </h3>
                <Users className="w-5 h-5 text-minimal-text-medium" />
              </div>
              <p className="text-2xl font-bold text-minimal-text-dark mb-2">
                42
              </p>
              <p className="text-xs text-minimal-text-light italic">
                Gray icon, no color
              </p>
            </div>

            {/* Card with Trend */}
            <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card hover:shadow-minimal-elevated transition-shadow duration-150 p-17">
              <h3 className="text-sm font-medium text-minimal-text-medium mb-13">
                With Trend
              </h3>
              <div className="flex items-baseline space-x-3 mb-2">
                <p className="text-2xl font-bold text-minimal-text-dark">
                  89
                </p>
                <div className="flex items-center px-2 py-1 bg-minimal-light-gray rounded text-xs font-medium text-minimal-text-dark">
                  <TrendingUp className="w-3 h-3 mr-1 text-minimal-text-medium" />
                  <span>12%</span>
                </div>
              </div>
              <p className="text-xs text-minimal-text-light italic">
                Monochrome trend badge
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Buttons */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            2. Minimal Buttons
          </h2>
          <div className="flex flex-wrap gap-13">
            {/* Primary Button */}
            <button className="bg-minimal-text-dark text-white rounded px-4 py-2 hover:bg-minimal-accent transition-colors duration-150">
              Primary Button
            </button>

            {/* Secondary Button */}
            <button className="bg-transparent border border-minimal-border-gray text-minimal-text-dark rounded px-4 py-2 hover:border-minimal-text-dark hover:bg-minimal-light-gray transition-all duration-150">
              Secondary Button
            </button>

            {/* Icon Button */}
            <button className="flex items-center space-x-2 bg-minimal-text-dark text-white rounded px-4 py-2 hover:bg-minimal-accent transition-colors duration-150">
              <Users className="w-4 h-4" />
              <span>With Icon</span>
            </button>

            {/* Outlined Icon Button */}
            <button className="flex items-center space-x-2 border border-minimal-border-gray text-minimal-text-dark rounded px-4 py-2 hover:border-minimal-text-dark hover:bg-minimal-light-gray transition-all duration-150">
              <Briefcase className="w-4 h-4 text-minimal-text-medium" />
              <span>Outlined</span>
            </button>
          </div>
        </section>

        {/* Section 3: Status Badges */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            3. Status Badges (Monochromatic)
          </h2>
          <div className="flex flex-wrap gap-13">
            {/* Active */}
            <span className="bg-minimal-status-active text-white border border-minimal-status-active rounded px-2 py-1 text-xs font-medium uppercase tracking-wide">
              Active
            </span>

            {/* Pending */}
            <span className="bg-minimal-light-gray text-minimal-status-pending border border-minimal-status-pending border-dashed rounded px-2 py-1 text-xs font-medium uppercase tracking-wide">
              Pending
            </span>

            {/* Completed */}
            <span className="bg-minimal-light-gray text-minimal-text-dark border-2 border-minimal-text-dark rounded px-2 py-1 text-xs font-medium uppercase tracking-wide">
              Completed
            </span>

            {/* Critical */}
            <span className="bg-red-50 text-minimal-status-critical border border-minimal-status-critical rounded px-2 py-1 text-xs font-medium uppercase tracking-wide">
              Critical
            </span>
          </div>

          <div className="mt-17">
            <h3 className="text-sm font-medium text-minimal-text-medium mb-13">
              Typography-Based Status
            </h3>
            <div className="flex flex-wrap gap-13">
              <span className="text-minimal-text-dark font-semibold">
                <span className="text-minimal-status-active mr-2">●</span>
                Active
              </span>
              <span className="text-minimal-text-dark font-semibold">
                <span className="text-minimal-text-light mr-2">●</span>
                Pending
              </span>
              <span className="text-minimal-text-dark font-semibold">
                <span className="text-minimal-status-critical mr-2">●</span>
                Critical
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Quick Actions */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            4. Quick Action Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-13">
            <button className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150">
              <Users className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Add Candidate</span>
            </button>

            <button className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150">
              <Briefcase className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Post Job</span>
            </button>

            <button className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150">
              <Calendar className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Schedule</span>
            </button>

            <button className="flex items-center space-x-3 p-13 border border-minimal-border-gray rounded hover:border-minimal-text-dark hover:bg-minimal-light-gray hover:shadow-minimal-card transition-all duration-150">
              <FileText className="w-5 h-5 text-minimal-text-medium" />
              <span className="text-sm font-medium text-minimal-text-dark">Reports</span>
            </button>
          </div>
        </section>

        {/* Section 5: Form Elements */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            5. Form Elements
          </h2>
          <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card p-17 max-w-md">
            <div className="space-y-13">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-minimal-text-dark mb-2">
                  Text Input
                </label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full border border-minimal-border-gray rounded px-3 py-2 text-sm text-minimal-text-dark placeholder-minimal-text-light placeholder-italic focus:outline-none focus:border-minimal-accent focus:shadow-[0_0_0_1px_#4a5568] transition-all duration-150"
                />
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-minimal-text-dark mb-2">
                  Search Input
                </label>
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-minimal-light-gray border border-minimal-border-gray rounded px-3 py-2 text-sm text-minimal-text-dark placeholder-minimal-text-light placeholder-italic focus:outline-none focus:bg-white focus:border-minimal-accent focus:shadow-[0_0_0_1px_#4a5568] transition-all duration-150"
                />
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-minimal-text-dark mb-2">
                  Textarea
                </label>
                <textarea
                  placeholder="Enter description..."
                  rows={3}
                  className="w-full border border-minimal-border-gray rounded px-3 py-2 text-sm text-minimal-text-dark placeholder-minimal-text-light placeholder-italic focus:outline-none focus:border-minimal-accent focus:shadow-[0_0_0_1px_#4a5568] transition-all duration-150"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Spacing Examples */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            6. Organic Spacing (Prime Numbers)
          </h2>
          <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card p-17">
            <div className="space-y-13">
              <div className="p-13 bg-minimal-light-gray rounded">
                <code className="text-xs text-minimal-text-dark">p-13 (13px padding)</code>
              </div>
              <div className="p-17 bg-minimal-light-gray rounded">
                <code className="text-xs text-minimal-text-dark">p-17 (17px padding)</code>
              </div>
              <div className="p-23 bg-minimal-light-gray rounded">
                <code className="text-xs text-minimal-text-dark">p-23 (23px padding)</code>
              </div>
              <div className="p-29 bg-minimal-light-gray rounded">
                <code className="text-xs text-minimal-text-dark">p-29 (29px padding)</code>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Table */}
        <section className="mb-29">
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            7. Clean Table Design
          </h2>
          <div className="bg-white border border-minimal-border-gray rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-minimal-light-gray">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-minimal-text-dark uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-minimal-text-dark uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-minimal-text-dark uppercase tracking-wide">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-minimal-border-gray hover:bg-minimal-off-white transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">Item 1</td>
                  <td className="px-4 py-3">
                    <span className="bg-minimal-status-active text-white rounded px-2 py-1 text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">$1,234</td>
                </tr>
                <tr className="border-t border-minimal-border-gray hover:bg-minimal-off-white transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">Item 2</td>
                  <td className="px-4 py-3">
                    <span className="bg-minimal-light-gray text-minimal-status-pending border border-minimal-status-pending border-dashed rounded px-2 py-1 text-xs font-medium">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">$5,678</td>
                </tr>
                <tr className="border-t border-minimal-border-gray hover:bg-minimal-off-white transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">Item 3</td>
                  <td className="px-4 py-3">
                    <span className="bg-minimal-light-gray text-minimal-text-dark border-2 border-minimal-text-dark rounded px-2 py-1 text-xs font-medium">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-minimal-text-dark">$9,012</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Design Principles */}
        <section>
          <h2 className="text-xl font-semibold text-minimal-text-dark mb-17">
            Design Principles
          </h2>
          <div className="bg-white rounded-md border border-minimal-border-gray shadow-minimal-card p-17">
            <ul className="space-y-13 text-sm text-minimal-text-dark">
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Clean white backgrounds with subtle shadows</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Monochromatic status system (no rainbow colors)</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Single accent color (muted blue-gray)</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Understated hover effects (no transforms)</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Simple, functional buttons (no gradients)</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Asymmetric layouts with organic spacing (13px, 17px, 23px)</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Typography-based indicators</span>
              </li>
              <li className="flex items-start">
                <span className="text-minimal-text-medium mr-3">✓</span>
                <span>Content-driven design (not rigid grids)</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
