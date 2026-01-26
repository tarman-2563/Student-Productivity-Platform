// Chart utility functions for analytics

// Generate chart colors based on data values
export const generateChartColors = (dataLength, baseColor = 'blue') => {
  const colorMaps = {
    blue: ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'],
    green: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46'],
    purple: ['#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9', '#5B21B6'],
    orange: ['#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#DC2626', '#B91C1C', '#991B1B'],
    red: ['#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B']
  };
  
  const colors = colorMaps[baseColor] || colorMaps.blue;
  return Array.from({ length: dataLength }, (_, i) => colors[i % colors.length]);
};

// Calculate chart dimensions and margins
export const calculateChartDimensions = (containerWidth, containerHeight, margins = {}) => {
  const defaultMargins = { top: 20, right: 20, bottom: 40, left: 40 };
  const finalMargins = { ...defaultMargins, ...margins };
  
  return {
    width: containerWidth - finalMargins.left - finalMargins.right,
    height: containerHeight - finalMargins.top - finalMargins.bottom,
    margins: finalMargins
  };
};

// Create scale functions for charts
export const createScales = (data, dimensions, scaleType = 'linear') => {
  const { width, height } = dimensions;
  
  // X Scale (typically for time or categories)
  const xScale = (value, index, total) => {
    return (index / (total - 1)) * width;
  };
  
  // Y Scale (for values)
  const maxValue = Math.max(...data.map(d => d.value || d.y || 0));
  const minValue = Math.min(...data.map(d => d.value || d.y || 0));
  
  const yScale = (value) => {
    if (scaleType === 'log') {
      const logMax = Math.log(maxValue);
      const logMin = Math.log(Math.max(minValue, 1));
      const logValue = Math.log(Math.max(value, 1));
      return height - ((logValue - logMin) / (logMax - logMin)) * height;
    } else {
      return height - ((value - minValue) / (maxValue - minValue)) * height;
    }
  };
  
  return { xScale, yScale, maxValue, minValue };
};

// Generate SVG path for line charts
export const generateLinePath = (data, xScale, yScale) => {
  if (!data || data.length === 0) return '';
  
  return data.reduce((path, point, index) => {
    const x = xScale(point.x || point.date, index, data.length);
    const y = yScale(point.y || point.value);
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${x} ${y}`;
  }, '').trim();
};

// Generate SVG path for area charts
export const generateAreaPath = (data, xScale, yScale, baselineY) => {
  if (!data || data.length === 0) return '';
  
  const linePath = generateLinePath(data, xScale, yScale);
  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  
  const lastX = xScale(lastPoint.x || lastPoint.date, data.length - 1, data.length);
  const firstX = xScale(firstPoint.x || firstPoint.date, 0, data.length);
  
  return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
};

// Format axis labels
export const formatAxisLabel = (value, type = 'number') => {
  switch (type) {
    case 'time':
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
      return value;
    case 'duration':
      if (value < 60) return `${value}m`;
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return minutes === 0 ? `${hours}h` : `${hours}h${minutes}m`;
    case 'percentage':
      return `${Math.round(value)}%`;
    case 'compact':
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
    default:
      return value.toString();
  }
};

// Calculate tick positions for axes
export const calculateTicks = (min, max, targetCount = 5) => {
  const range = max - min;
  const roughStep = range / (targetCount - 1);
  
  // Find a "nice" step size
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;
  
  let niceStep;
  if (normalizedStep <= 1) niceStep = 1;
  else if (normalizedStep <= 2) niceStep = 2;
  else if (normalizedStep <= 5) niceStep = 5;
  else niceStep = 10;
  
  const step = niceStep * magnitude;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  
  const ticks = [];
  for (let tick = niceMin; tick <= niceMax; tick += step) {
    ticks.push(Math.round(tick * 100) / 100); // Round to avoid floating point issues
  }
  
  return ticks;
};

// Create gradient definitions for SVG
export const createGradientDef = (id, color, direction = 'vertical') => {
  const isVertical = direction === 'vertical';
  return {
    id,
    x1: isVertical ? '0%' : '0%',
    y1: isVertical ? '0%' : '0%',
    x2: isVertical ? '0%' : '100%',
    y2: isVertical ? '100%' : '0%',
    stops: [
      { offset: '0%', stopColor: color, stopOpacity: 0.8 },
      { offset: '100%', stopColor: color, stopOpacity: 0.1 }
    ]
  };
};

// Animate chart values
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + (end - start) * easeOut;
    
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Detect chart interaction points
export const getInteractionPoint = (event, chartElement, data, xScale) => {
  const rect = chartElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  
  // Find closest data point
  let closestIndex = 0;
  let closestDistance = Infinity;
  
  data.forEach((point, index) => {
    const pointX = xScale(point.x || point.date, index, data.length);
    const distance = Math.abs(x - pointX);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  
  return {
    index: closestIndex,
    data: data[closestIndex],
    x: xScale(data[closestIndex].x || data[closestIndex].date, closestIndex, data.length)
  };
};