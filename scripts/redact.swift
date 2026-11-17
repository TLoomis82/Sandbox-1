// Blurs rectangles in an image in place, for hiding names and contact details.
//   swift scripts/redact.swift <image.jpg> <x,y,w,h> [<x,y,w,h> ...]
// Rects are in pixels of that image, measured from the top-left corner.
import AppKit
import CoreImage

let args = CommandLine.arguments
guard args.count >= 3, let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("usage: redact.swift <image> <x,y,w,h>...\n".data(using: .utf8)!)
  exit(1)
}
let height = input.extent.height
var output = input
for spec in args.dropFirst(2) {
  let n = spec.split(separator: ",").compactMap { Double($0) }
  guard n.count == 4 else { continue }
  // Core Image's origin is bottom-left.
  let rect = CGRect(x: n[0], y: Double(height) - n[1] - n[3], width: n[2], height: n[3])
  let blurred = input.clampedToExtent()
    .applyingGaussianBlur(sigma: 16)
    .cropped(to: rect)
  output = blurred.composited(over: output)
}
let ctx = CIContext()
let cg = ctx.createCGImage(output, from: input.extent)!
let rep = NSBitmapImageRep(cgImage: cg)
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
  .write(to: URL(fileURLWithPath: args[1]))
print("redacted \(args[1])")
