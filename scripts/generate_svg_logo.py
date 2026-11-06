import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Open the original logo image
img = Image.open('public/images/logo.png').convert('L')
arr = np.array(img, dtype=float)

# Bounding box of text: y in [255, 365], x in [150, 495]
crop = arr[255:365, 150:495]
bg_val = np.median(arr[:30, :30])
text_val = crop.max()
threshold = bg_val + (text_val - bg_val) * 0.45

fig, ax = plt.subplots(figsize=(10, 4))
# Default orientation maps rows to Y (0 at top, H at bottom) matching SVG
cs = ax.contour(crop, levels=[threshold])

path_strs = []
h, w = crop.shape

# Collect all polygons
for seg in cs.allsegs[0]:
    if len(seg) < 4:
        continue
    d_parts = []
    for i, pt in enumerate(seg):
        cmd = 'M' if i == 0 else 'L'
        d_parts.append(f"{cmd}{pt[0]:.1f},{pt[1]:.1f}")
    d_parts.append('Z')
    path_strs.append(' '.join(d_parts))

plt.close(fig)

combined_d = ' '.join(path_strs)
print(f"Generated {len(path_strs)} contour loops. Total path length: {len(combined_d)}")

template = """import React from 'react';

interface RaffiniLogoSvgProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  className?: string;
}

/**
 * 1:1 Vector SVG representation of the official RAFFINI brand logo.
 * Precision-extracted from official brand typography. Upright and razor-sharp.
 */
export function RaffiniLogoSvg({
  color = '#FAE9D7',
  className = 'w-auto h-8',
  ...props
}: RaffiniLogoSvgProps) {
  return (
    <svg
      viewBox="0 0 __WIDTH__ __HEIGHT__"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RAFFINI"
      {...props}
    >
      <path
        d="__PATH__"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default RaffiniLogoSvg;
"""

tsx_content = template.replace('__WIDTH__', str(w)).replace('__HEIGHT__', str(h)).replace('__PATH__', combined_d)

with open('src/components/RaffiniLogoSvg.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_content)

print("Saved upright src/components/RaffiniLogoSvg.tsx successfully!")
