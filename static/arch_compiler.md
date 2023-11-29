ArchCompiler
===

Prototype de fusion de `ArchParser` + `ViewCompiler`.
- `ArchParser` extrait des informations de l'arch pour les donner aux vues.
- `ViewCompiler` transforme l'arch en template owl.

Les deux systèmes sont séparés, ce qui fait que l'arch est parcouru deux fois.
`ArchCompiler` permet d'extraire les informations et générer le template owl en parcourant qu'une seule fois l'arch.

## API

Signature habituelle d'une fonction de compilation:
```typescript
function compileArch(element: Element, params: object = {}): any;
```

Les fonctions de compilation prennent en paramètres l'`element` de l'arch à parser et des `params` globaux comme les modèles à utiliser. Elles renvoient généralement une fonction pour `render` le template owl.

```typescript
function render(params: any): { node: Node, context: object }
```
Les fonctions `render` renvoient un `node` ainsi qu'un `context`.
Le `node` est le template owl et le `context`, toutes les données qui sont utilisées
par ce template.
Avec ces deux informations, on peut faire un `t-call` et `t-call-context`.

```xml
<!-- template -->
<t t-component="comp.component" t-props="comp.props"/>
<!-- context -->
{
    comp: {
        component: Button,
        props: {
            onClick() { console.log("hello"); },
        },
    },
}
<!-- parent component's template -->
<t t-call="owl.xml`${node.outerHTML}`" t-call-context="context"/>
```

`ViewCompiler` est fortement couplé au renderer qui l'utilise. Quand un composant ou une fonction est utilisé, il doit être défini dans le renderer. Le template utilise le contexte du renderer. `ArchCompiler` crée le template et le contexte lié au même endroit. 


## Principes

- Extrait les informations de l'arch
- Crée un template pour la vue et son contexte
- Crée toute la vue (control panel + controller + renderer) au lieu de juste créer le renderer
- Parse les vues ET ce qu'il y a en dessous (boutons, fields, widgets)
    - Parse aussi les renderers dans les fields x2many
- Les tags kanban/form/tree/... ne sont pas spécialement considéré comme des vues
- Les fields ne sont plus des composants
    - Les compilateurs décident de mettre un composant ou non
- Les renderers des vues ne sont plus liés à la vue mais sont des composants générique
    - KanbanRenderer -> Kanban / DataGrid
    - FormRenderer -> pas de composant (peut être?)
    - ListRenderer -> DataTable


## Exemple

```typescript
function compilerArchCharField(element, params) {
    const name = element.getAttribute("name");
    return {
        info: new FieldInfo({ name });
        render: () => `<input .../>`,
        renderReadonly: () => `<span .../>`,
    };
}

function compileArchField(element, params) {
    const name = element.getAttribute("name");
    const type = params.models[params.modelName].type;
    const variant = element.getAttribute("widget");
    const compileField = findFieldCompiler(variant ?? fieldDef.type);
    return compileField(element, params);
}

// --------------------------------------------------------

function compileArchKanban(element, params) {
    //...
    const fieldsInfo = [];
    const field = compileArchField(child, params);
    fieldsInfo.push(field.info);
    //...
    return {
        fieldsInfo,
        render: ({ expr }) => ({
            node: `<t t-component="${expr.get("component")}" t-props="${expr.get("props")}">record</t>`
            context: {
                component: DataGrid,
                props: { records: [] },
            },
        })
    };
}

function compileArchKanbanView(element, params) {
    const kanban = compileArchKanban(element, params);
    const controller = new KanbanViewController({ fieldsInfo });
    return {
        controller,
        ...
    };
}

function compileArchView(element, params) {
    const type = element.tagName;
    const variant = element.getAttribute("js_class");
    const compileView = findViewCompiler(variant ?? type);
    return compileView(element, params);
}

```
