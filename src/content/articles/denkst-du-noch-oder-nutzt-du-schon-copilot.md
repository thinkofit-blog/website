---
title: "Denkst du noch oder nutzt du schon Copilot?"
description: "KI hält uns davon ab, bessere Programmierer zu werden. Vielleicht hilft sie uns aber auch dabei, dass wir das gar nicht mehr müssen."
short: Copilot
pubDate: "May 29 2024"
heroImage: "/lazy_nvim.jpg"
---

KI hält uns davon ab, bessere Programmierer zu werden. Vielleicht hilft sie uns aber auch dabei, dass wir das gar nicht mehr müssen.

_Wir meinen mit Copilot alle Code schreibenden KIs_

---

## (Ver)lernen wir gerade die wichtigen Sachen?

Wir Studenten bzw. Programmieranfänger müssen das Coden erst lernen. Da ist es ziemlich praktisch, dass für Studenten Copilot gratis ist. Wie verlockend und gefährlich das ist, haben wir hautnah miterlebt und man sollte echt über uns nachdenken.

Was passiert mit jemandem, der programmieren lernt und dabei Copilot und Co verwendet? Unser Fazit: nicht viel. Die eigentlichen Lernziele bleiben aus, wenn man Copilot die Codeaufgabe machen lässt und nicht weiß, warum es funktioniert. Die 1,0 gibt es aus unserer Erfahrung oft trotzdem.

Es ist ähnlich wie jemand der in einer Klausur vom Nachbarn abschreibt und eine gute Note bekommt. Bedeutet das, dass man den Stoff der Klausur beherrscht? Definitiv nicht.

Copilot ist sogar noch schlimmer, weil nicht einmal mehr selbst abgeschrieben werden muss. Das macht Copilot für uns und es fühlt sich tortzdem an, als wäre das Ergebnis aus eigener Leistung entstanden. Copilot gibt Antworten auf Fragen, bei denen man nicht weiß, dass sie wichtig sind.

![Frank‘s Vorstellung, wie Vanessa mit Copilot arbeitet.](/lazy_nvim.jpg)

Wodurch lernt man programmieren? Durch Ausprobieren und möglichst viele Fehler machen. Unsere These ist, dass Copilot uns daran hindert, die Fehler zu machen, die wir als Transferleistung zum Lösen weiterführender Probleme benötigen.

Aber ist das vielleicht der neue Skill, der in Zukunft gebraucht wird? Halten wir zu sehr an gewohnten, “alten” Sachen fest? Vielleicht ist es in der Zukunft einfach wichtiger, sich auf das Gesamtbild zu konzentrieren und die Schritte dorthin gut formulieren zu können.  
Als das “Werkzeug” Auto erfunden wurde, sind viele Kutscher innerhalb kürzester Zeit arbeitslos geworden. Und das klassische “Programmieren” ist vielleicht das Kutschen-fahren, was in unbestimmter Zukunft abgelöst wird.

## Wie zuverlässig ist Copilot?

Gerade wenn es um das Lernen geht, ist besorgniserregend:  
Copilot gibt gelegentlich falsche Code, der trotzdem funktionieren und richtige Ergebnisse hervorbringt..

Hier ist eine von Copilot falsch generierte QuickSort-Funktion. Sie sortiert zwar korrekt, implementiert aber nicht den QuickSort Algorithmus.  
Prompt: `function quickSort(arr) {`

```js
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr
    }

    const pivot = arr[0]
    const left = []
    const right = []

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }

    return quickSort(left).concat(pivot, quickSort(right))
}
```

[GitHub beschreibt in ihrer FAQ](https://web.archive.org/web/20240427085217/https://github.com/features/copilot#faq), dass sämtliche (oder ein erheblicher Anteil) der öffentlichen Repositorys auf der Plattform GitHub dazu verwendet werden, die KI Copilot zu trainieren. Jetzt kann man die These aufstellen, dass Studenten und Schüler mehr Zeit für private Projekte haben, die auf GitHub veröffentlicht werden, als erfahrene Seniors.

Demnach ist anzunehmen, dass viel öffentlicher Code auf GitHub von unerfahrenen Programmierern stammt und auch nicht von einem zweiten reviewt werden. Denken wir jetzt mal darüber nach, von welcher Qualität demnach viele Repositorys sein müssen, mit denen Copilot lernt. Das erklärt, warum es gelegentlich Vorschläge gibt, die schlecht oder einfach nur falsch sind. Ein Programmieranfänger kann das unter Umständen nicht erkennen.

## Zerstört Copilot unsere Selbstkritik?

[Eine Studie](https://arxiv.org/abs/2211.03622) hat gezeigt:  
Menschen, welche Zugang zu AI Assistants hatten, produzierten Code mit Sicherheitslücken und empfanden diesen als sicher. Menschen, keinen Zugang hatten empfanden ihren Code als unsicher, in Realität hatte dieser jedoch signifikant weniger Sicherheitslücken.

Das zeigt: Copilot macht uns zum Copiloten. Dabei ist Copilot nicht in der Lage, vorauszudenken und künftig wahrscheinliche Anforderungen in die Architektur einzubeziehen.

Ein weiterer Punkt ist, mit Copilot kommt man bis zu einem gewissen Grad. Danach müssen Menschen übernehmen, die die Details wirklich kennen. Wenn Copilot einfache Aufgaben selbstständig lösen kann, besteht die Gefahr, dass viele junge Entwickler die Eigenheiten von so manchen Problemen gar nicht erst lernen.  
Das, gepaart mit dem oben erwähnten Phänomen des unkritischen Umgangs mit generierten Codes, führt zur Frage: Wie sollen diese dann mit den Problemen zurechtkommen, bei denen Copilot nicht helfen kann?

Um positiv abzuschließen: Durch Copilot haben wir das Potential durch neue Denkweisen andere (und potentiell größere) Probleme zu lösen. Wichtig dabei ist, dass wir dabei nicht mit dem Denken aufhören.

## Bringen wir die KI durch Vermenschlichung um ihr eigentliches Potential?

So wie es bisher aussieht, müssen wir aktuell (noch) besser im Programmieren an sich werden. Die KI-Werkzeuge wie Copilot sind noch weit davon entfernt einen guten Entwickler ersetzen zu können. Was müsste sich bei den KI-Werkzeugen ändern, damit diese eine Alternative zum Menschen darstellen?

Unsere Meinung: Derzeit verwendete Programmiersprachen wurden für uns gemacht, nicht für KIs. Generative KIs haben aktuell einen enormen Nachteil, weil wir sie dazu bringen wollen, das Problem mit Werkzeugen für Menschen zu lösen.

Wenn wir für KIs eigene Programmiersprachen schaffen, die direkt zum Ziel kompiliert werden, bekommen KIs die beste Möglichkeit, ein verwendbares Ergebnis erzielen zu können. Bei der Entwicklung einer solchen Programmiersprache ist es eine wichtige Überlegung, inwieweit diese für Menschen lesbar sein soll.

## Fazit

Noch müssen wir selbst besser im Programmieren werden, jedoch nimmt uns Copilot potentiell den Steuerplatz bei der Programmiertätigkeit ab.

Wir sehen da auch die Verantwortung in der Gesellschaft, das angesteuerte Ziel nicht aus den Augen zu verlieren. Wir hoffen, wir finden zusammen auch bald raus, was das im Kontext von KI eigentlich ist.

Zum Glück heißt es ja, der Weg ist das Ziel.  
Und davon haben wir noch mehr als genug vor uns.

Written by real humans.

[![this product is ai free](https://this-product-is-ai-free.github.io/badge.svg)](https://this-product-is-ai-free.github.io)
