import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(S.documentTypeListItems())
    // .items([
    //   S.documentTypeListItem('galleryImage').title('Gallery'),
    //   S.documentTypeListItem('heroSection').title('Hero'),
    //   S.documentTypeListItem('aboutUsSection').title('About Us'),

    //   S.divider(),
    //   ...S.documentTypeListItems().filter(
    //     (item) => item.getId() && !['post', 'category', 'author'].includes(item.getId()!),
    //   ),
    // ])
