import React from 'react';
import { PieChart, Pie, Cell, Tooltip as Tip } from 'recharts';

export const Donut = ({ children, Tooltip,
 cx, cy, innerRadius, outerRadius, width, height }) =>
    <PieChart width={width} height={height}>
        <Pie
          data={children} cx={cx} cy={cy}
          innerRadius={innerRadius} outerRadius={outerRadius}
        >
            {children.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  className={entry.name}
                />
            )}
        </Pie>
        <Tip content={<Tooltip />} />
    </PieChart>;
