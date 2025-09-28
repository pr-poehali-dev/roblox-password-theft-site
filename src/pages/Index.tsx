import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Icon from '@/components/ui/icon'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  description: string
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Беспроводные наушники",
    price: 4990,
    originalPrice: 6990,
    discount: 30,
    image: "/img/9e21ac95-2cdf-4663-ba12-99397b71c5bc.jpg",
    category: "Аудио",
    description: "Премиальные беспроводные наушники с активным шумоподавлением"
  },
  {
    id: 2,
    name: "Смартфон Pro",
    price: 89990,
    originalPrice: 99990,
    discount: 10,
    image: "/img/696a4709-52bc-4d64-9056-d88c82839583.jpg",
    category: "Телефоны",
    description: "Флагманский смартфон с профессиональной камерой"
  },
  {
    id: 3,
    name: "Ноутбук Ultra",
    price: 129990,
    image: "/img/902024ea-7f9a-4545-a3c1-a88b790d2ad7.jpg",
    category: "Компьютеры",
    description: "Ультратонкий ноутбук для работы и творчества"
  }
]

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Все')
  const [promoCode, setPromoCode] = useState<string>('')
  const [appliedPromo, setAppliedPromo] = useState<string>('')
  const [promoDiscount, setPromoDiscount] = useState<number>(0)

  const categories = ['Все', 'Аудио', 'Телефоны', 'Компьютеры']
  
  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const applyPromoCode = () => {
    const promoCodes: { [key: string]: number } = {
      'SAVE10': 10,
      'WELCOME20': 20,
      'MEGA30': 30
    }
    
    const discount = promoCodes[promoCode.toUpperCase()]
    if (discount) {
      setAppliedPromo(promoCode.toUpperCase())
      setPromoDiscount(discount)
      setPromoCode('')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const promoDiscountAmount = (subtotal * promoDiscount) / 100
  const total = subtotal - promoDiscountAmount

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background font-['Helvetica',sans-serif]">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-foreground">Store</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartItemsCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>
                    {cartItemsCount === 0 ? 'Корзина пуста' : `${cartItemsCount} товаров в корзине`}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()} ₽
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {cart.length > 0 && (
                    <>
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Промокод"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={applyPromoCode} variant="outline" size="sm">
                            Применить
                          </Button>
                        </div>
                        
                        {appliedPromo && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Промокод {appliedPromo}:</span>
                            <span>-{promoDiscountAmount.toLocaleString()} ₽</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span>Подытог:</span>
                          <span>{subtotal.toLocaleString()} ₽</span>
                        </div>
                        
                        <div className="flex justify-between font-medium text-lg">
                          <span>Итого:</span>
                          <span>{total.toLocaleString()} ₽</span>
                        </div>
                        
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Категории</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-light mb-2">Каталог товаров</h2>
              <p className="text-muted-foreground">
                Откройте для себя наши премиальные продукты
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                      {product.discount && (
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      )}
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-light">
                        {product.price.toLocaleString()} ₽
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()} ₽
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(product)}
                    >
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Index