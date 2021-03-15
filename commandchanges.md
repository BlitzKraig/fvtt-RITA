# Command & localization changelog

## ver 2

Added responses object

Changed commands using optional strings `()` such as `(a)` or `(an)` to instead use `(a )` and `(an )`.
This change was needed to prevent a/an from being stripped from the beginning of words.

Added appropriate spaces to optional strings and removed unnecessary spaces between optional strings.

Localizers should make similar changes to their optional strings.