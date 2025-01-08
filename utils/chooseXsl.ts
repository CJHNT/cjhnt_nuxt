export default function (urn: string) {
  switch (true) {
    case urn.includes('commentary'):
      return 'assets/source/commentary.sef.json'
    case urn.includes('tlg0031'):
    case urn.includes('tlg0527'):
    case urn.includes('1henoch'):
      return 'assets/source/nt_fragment.sef.json'
    case urn.includes('qumran'):
      return 'assets/source/qumran.sef.json'
    default:
      return 'assets/source/epidoc.sef.json'
  }
}
