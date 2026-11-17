// Renders PDF pages to PNG with near-white margins trimmed.
//   swift scripts/pdfpage.swift <in.pdf> <page> <out.png>     one page (1-based)
//   swift scripts/pdfpage.swift <in.pdf> <a>+<b> <out.png>    two pages side by side, labeled Before / After
//   swift scripts/pdfpage.swift <in.pdf> count                print the page count
import AppKit
import PDFKit

func fail(_ msg: String) -> Never {
  FileHandle.standardError.write("\(msg)\n".data(using: .utf8)!)
  exit(1)
}

func makeContext(_ w: Int, _ h: Int) -> CGContext {
  let ctx = CGContext(
    data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
  ctx.setFillColor(.white)
  ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
  return ctx
}

/// Renders a page and crops to its content. Starts at 2x; if the content is small
/// on the page, re-renders at a higher scale so it comes out at least ~1200px wide.
func render(_ page: PDFPage) -> CGImage {
  let first = render(page, scale: 2)
  guard first.width < 1200 else { return first }
  let scale = min(8, 2 * 1200 / CGFloat(max(first.width, 1)))
  return render(page, scale: scale)
}

func render(_ page: PDFPage, scale: CGFloat) -> CGImage {
  let bounds = page.bounds(for: .mediaBox)
  let w = Int(bounds.width * scale), h = Int(bounds.height * scale)
  let ctx = makeContext(w, h)
  ctx.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx)

  let px = ctx.data!.bindMemory(to: UInt8.self, capacity: w * h * 4)
  var minX = w, minY = h, maxX = -1, maxY = -1
  for y in 0..<h {
    for x in 0..<w {
      let i = (y * w + x) * 4
      if px[i] < 245 || px[i + 1] < 245 || px[i + 2] < 245 {
        minX = min(minX, x); maxX = max(maxX, x)
        minY = min(minY, y); maxY = max(maxY, y)
      }
    }
  }
  let image = ctx.makeImage()!
  guard maxX > minX, maxY > minY else { return image }
  let pad = Int(12 * scale)
  let x0 = max(0, minX - pad), y0 = max(0, minY - pad)
  let crop = CGRect(x: x0, y: y0, width: min(w, maxX + pad) - x0, height: min(h, maxY + pad) - y0)
  return image.cropping(to: crop) ?? image
}

/// Two images scaled to the same height, side by side, with a label above each.
func beforeAfter(_ a: CGImage, _ b: CGImage) -> CGImage {
  let height = max(a.height, b.height)
  let gap = 96, margin = 48, labelH = 110
  let wa = a.width * height / a.height, wb = b.width * height / b.height
  let W = margin * 2 + wa + gap + wb, H = margin * 2 + labelH + height
  let ctx = makeContext(W, H)
  ctx.interpolationQuality = .high
  ctx.draw(a, in: CGRect(x: margin, y: margin, width: wa, height: height))
  ctx.draw(b, in: CGRect(x: margin + wa + gap, y: margin, width: wb, height: height))
  NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
  let font = NSFont.systemFont(ofSize: 56, weight: .semibold)
  for (text, x) in [("Before", margin), ("After", margin + wa + gap)] {
    NSAttributedString(string: text, attributes: [.font: font, .foregroundColor: NSColor(white: 0.12, alpha: 1)])
      .draw(at: CGPoint(x: x, y: margin + height + 28))
  }
  return ctx.makeImage()!
}

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  fail("usage: pdfpage.swift <in.pdf> <page|a+b|count> [out.png]")
}
if args[2] == "count" {
  print(doc.pageCount)
  exit(0)
}
guard args.count == 4 else { fail("missing output path") }

let pages = args[2].split(separator: "+").map { n -> PDFPage in
  guard let i = Int(n), let page = doc.page(at: i - 1) else {
    fail("page \(n) out of range (document has \(doc.pageCount))")
  }
  return page
}
let image: CGImage
switch pages.count {
case 1: image = render(pages[0])
case 2: image = beforeAfter(render(pages[0]), render(pages[1]))
default: fail("give one page or two joined with +")
}
let rep = NSBitmapImageRep(cgImage: image)
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[3]))
print("\(args[3]) \(image.width)x\(image.height)")
